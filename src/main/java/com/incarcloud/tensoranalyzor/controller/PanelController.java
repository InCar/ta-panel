package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.GitVer;
import com.incarcloud.tensoranalyzor.entities.SubmitTaskResult;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.*;
import java.net.*;
import java.net.URL;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping(path="api")
public class PanelController {
    private static final Logger s_logger = LoggerFactory.getLogger(PanelController.class);
    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;
    private URL _backPoint;
    private HttpClient httpClient = HttpClient.newHttpClient();

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
        s_logger.info("Received: {}", json.length());
        URL backpoint = findBackPoint(request);

        return Mono.create(sink->{
            sink.onRequest(x->{
                try{
                    URL api = new URL(backpoint, "/api/task/start");
                    s_logger.info("BackPoint: {}", api);
                    HttpRequest backPointRequest = HttpRequest.newBuilder()
                            .uri(api.toURI())
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(json))
                            .timeout(Duration.ofMillis(3000))
                            .build();
                    CompletableFuture<HttpResponse<String>> waitResp =  httpClient.sendAsync(backPointRequest, HttpResponse.BodyHandlers.ofString());
                    waitResp.thenAccept(resp->{
                        response.setRawStatusCode(resp.statusCode());
                        sink.success(new SubmitTaskResult(0, resp.body()));
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
