package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.Application;
import com.incarcloud.tensoranalyzor.GitVer;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.buffer.DataBuffer;
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
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Flow;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

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
        return String.format("%d", Application.s_tmStart);
    }

    @GetMapping("version")
    public Mono<GitVer> version(ServerHttpResponse response){
        return Mono.fromCallable(()->{
            GitVer version = new GitVer();
            return version;
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

    @RequestMapping("/{path:task}/**")
    public Mono<String> ForwardBackPoint(
            @RequestBody(required = false) String jsonBody,
            ServerHttpRequest request,
            ServerHttpResponse response){
        URL backPoint = findBackPoint(request);
        URI uri = request.getURI();
        String path = uri.getPath();
        String query = uri.getQuery();
        final String api = query==null?path:path+"?"+query;

        HttpRequest.BodyPublisher bp;
        if(jsonBody == null)
            bp = HttpRequest.BodyPublishers.noBody();
        else
            bp = HttpRequest.BodyPublishers.ofString(jsonBody);

        final HttpRequest.BodyPublisher bodyPublisher = bp;

        return Mono.create(sink->{
            sink.onRequest(x->{
                try {
                    URL backAPI = new URL(backPoint, api);
                    String strMethod = request.getMethodValue();
                    s_logger.info("BackPoint : {} {}", strMethod, backAPI);

                    HttpRequest.Builder builder = HttpRequest.newBuilder();
                    builder.method(strMethod, bodyPublisher);

                    // headers
                    List<String> excludeHeaders = Arrays.asList("connection", "host", "content-length", "accept-encoding");
                    request.getHeaders().forEach((k, v)->{
                        if(!excludeHeaders.contains(k.toLowerCase())) {
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
                        String messageMore = "";
                        if(request.getHeaders().get("X-Back-Point") != null){
                            messageMore = " : " + backAPI.toString();
                        }

                        if(e.getCause() != null && e.getCause().getClass().equals(ConnectException.class)){
                            response.setRawStatusCode(503);
                            sink.success("BackPoint 连接失败: " + e.getCause().toString() + messageMore);
                            return null;
                        }
                        else if(e.getCause() != null && e.getCause().getClass().equals(HttpConnectTimeoutException.class)){
                            response.setRawStatusCode(504);
                            sink.success("BackPoint响应超时: " + e.getCause().getMessage() + messageMore);
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