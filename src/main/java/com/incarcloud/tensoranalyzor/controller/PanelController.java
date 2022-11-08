package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.GitVer;
import com.incarcloud.tensoranalyzor.entities.SubmitTaskResult;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.*;
import java.net.*;
import java.net.URL;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Flow;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping(path="api")
public class PanelController {
    private static final Logger s_logger = LoggerFactory.getLogger(PanelController.class);
    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;
    private URL _backPoint;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public PanelController(@Value("${tensor-analyzor.back-point}") String back_point){
        try {
            _backPoint = new URL(back_point);
        } catch (MalformedURLException e) {
            s_logger.error(e.getMessage());
        }
    }

    @GetMapping("hello")
    public String greeting(ServerHttpResponse response){
        GitVer version = new GitVer();
        return version.getVersion();
    }

    @GetMapping("version")
    public Mono<String> version(ServerHttpResponse response){
        return Mono.fromCallable(()->{
            GitVer version = new GitVer();
            return version.getVersion();
        });
    }

    @GetMapping("fields")
    public Mono<String> getFields(ServerHttpResponse response){
        return Mono.fromCallable(()->{
            String json = this.loadSample();
            if(!FieldsExpr.Validate(json)){
                response.setStatusCode(HttpStatus.EXPECTATION_FAILED);
                return String.format("校验失败\n%s", json);
            }

            return json;
        });
    }

    private String loadSample(){
        StringBuilder sbJson = new StringBuilder();
        // reading sample
        try(InputStream isJson = this.getClass().getResourceAsStream("/" + this.fieldsFile)){
            InputStreamReader reader = new InputStreamReader(isJson, StandardCharsets.UTF_8);
            final int nSize = 4096;
            char[] buf = new char[nSize];
            int nRead = 0;
            do {
                nRead = reader.read(buf);
                sbJson.append(buf, 0, nRead);
            } while (nRead == nSize);

        }
        catch(IOException ex){
            s_logger.error(ex.getMessage());
        }

        return sbJson.toString();
    }

    @PostMapping("submit-task")
    public Mono<SubmitTaskResult> SubmitTask(@RequestBody String json, ServerHttpRequest request, ServerHttpResponse response){
        // s_logger.info("Received: {}", json.length());
        URL backpoint = findBackPoint(request);

        return Mono.create(sink->{
            sink.onRequest(x->{
                try{
                    URL api = new URL(backpoint, "/api/task/start");
                    // s_logger.info("BackPoint: {}", api);
                    HttpRequest backPointRequest = HttpRequest.newBuilder()
                            .uri(api.toURI())
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(json))
                            .timeout(Duration.ofMillis(3000))
                            .build();
                    CompletableFuture<HttpResponse<String>> waitResp =  httpClient.sendAsync(backPointRequest, HttpResponse.BodyHandlers.ofString());
                    waitResp.thenAccept(resp->{
                        response.setRawStatusCode(resp.statusCode());
                        if(resp.statusCode() < 400)
                            sink.success(new SubmitTaskResult(0, resp.body()));
                        else
                            sink.success(new SubmitTaskResult(-2, resp.body()));
                    }).exceptionally((e)->{
                        response.setRawStatusCode(500);
                        sink.success(new SubmitTaskResult(-1, e.getMessage()));
                        return null;
                    });
                }
                catch (MalformedURLException | URISyntaxException e){
                    sink.error(e);
                }
            });
        });
    }

    @RequestMapping("/{path:task}/**")
    public Mono<String> ForwardBackPoint(ServerHttpRequest request,
                                         ServerHttpResponse response){
        URL backPoint = findBackPoint(request);
        URI uri = request.getURI();
        String path = uri.getPath();
        String query = uri.getQuery();
        final String api = query==null?path:path+"?"+query;

        HttpRequest.BodyPublisher bodyPublisher = HttpRequest.BodyPublishers.fromPublisher(s->{
            s.onSubscribe(new Flow.Subscription(){
                // webflux总是触发多次body
                private boolean hasCompleted = false;
                public void request(long n){
                    Flux<DataBuffer> fluxBody = request.getBody();
                    fluxBody.subscribe(buf->{
                        if(buf != null){
                            // String body = StandardCharsets.UTF_8.decode(buf.asByteBuffer()).toString();
                            // s_logger.info("body {}", body);
                            s.onNext(buf.asByteBuffer());
                        }
                    });
                    fluxBody.hasElements().subscribe((hasBody)->{
                        if(!hasCompleted && !hasBody){
                            // without body
                            hasCompleted = true;
                            s.onComplete();
                        }
                    });
                }
                public void cancel(){}
            });
        });

        return Mono.create(sink->{
            sink.onRequest(x->{
                try {
                    URL backAPI = new URL(backPoint, api);
                    String strMethod = request.getMethodValue();
                    s_logger.info("BackPoint : {} : {}", strMethod, backAPI);

                    HttpRequest.Builder builder = HttpRequest.newBuilder();
                    builder.method(strMethod, bodyPublisher);

                    // headers
                    List<String> excludeHeaders = Arrays.asList("connection", "host", "content-length", "accept-encoding");
                    request.getHeaders().forEach((k, v)->{
                        if(!excludeHeaders.contains(k)) {
                            // s_logger.info("{} {}", k, v);
                            builder.setHeader(k, String.join(",", v));
                        }
                    });

                    HttpRequest backPointRequest = builder.uri(backAPI.toURI())
                            .timeout(Duration.ofMillis(3000))
                            .build();

                    CompletableFuture<HttpResponse<String>> waitResp =  httpClient.sendAsync(backPointRequest, HttpResponse.BodyHandlers.ofString());
                    waitResp.thenAccept(resp->{
                        resp.headers().map().forEach((k,v)->{
                            response.getHeaders().add(k, String.join(",", v));
                        });

                        response.setRawStatusCode(resp.statusCode());
                        sink.success(resp.body());
                    }).exceptionally((e)->{
                        if(e.getCause() != null && e.getCause().getClass().equals(ConnectException.class)){
                            response.setRawStatusCode(504);
                            sink.success("BackPoint响应超时");
                            return null;
                        }
                        response.setRawStatusCode(500);
                        sink.success(e.toString());

                        return null;
                    });
                }
                catch (MalformedURLException | URISyntaxException e){
                    sink.error(e);
                }
            });
        });
    }

    private URL findBackPoint(ServerHttpRequest  request){
        List<String> listBackPoints = request.getHeaders().get("X-Back-Point");
        if(listBackPoints != null && listBackPoints.size() > 0) {
            String strBP = listBackPoints.get(0);
            try {
                return new URL(strBP);
            } catch (MalformedURLException e) {
                s_logger.error(e.getMessage());
            }
        }

        return _backPoint;
    }
}
