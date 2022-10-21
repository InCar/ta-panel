package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.entities.SubmitTaskResult;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.MonoSink;

import java.io.*;
import java.net.*;
import java.net.URL;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

@RestController
@RequestMapping(path="api")
public class PanelController {
    private static final Logger s_logger = LoggerFactory.getLogger(PanelController.class);
    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;
    private URL backEndServer;
    private HttpClient httpClient = HttpClient.newHttpClient();

    public PanelController(@Value("${tensor-analyzor.back-end-server}") String back_end_server){
        try {
            backEndServer = new URL(back_end_server);
        } catch (MalformedURLException e) {
            s_logger.error(e.getMessage());
        }
    }

    @GetMapping("hello")
    public Mono<String> greeting(ServerHttpResponse response){
        return Mono.fromCallable(()->{
            String json = loadSample();

            if(!FieldsExpr.Validate(json)){
                response.setStatusCode(HttpStatus.EXPECTATION_FAILED);
                return String.format("校验失败\n%s", json);
            }

            FieldsExpr target = new FieldsExpr(json);
            Map<String, FieldRef> mapFields = target.getFields();
            StringBuilder sbBuf = new StringBuilder();
            for(String k : mapFields.keySet()){
                sbBuf.append(k);
                FieldRef refV = mapFields.get(k);
                sbBuf.append(" : ");
                sbBuf.append(refV.getDataPath());
                sbBuf.append(" : ");
                if(refV.getDesc() != null)
                    sbBuf.append(refV.getDesc());
                sbBuf.append(" : ");
                if(refV.getDescription() != null)
                    sbBuf.append(refV.getDescription());
                sbBuf.append('\n');
            }
            return sbBuf.toString();
        });
    }

    @GetMapping("fields")
    public Mono<String> getFields(){
        return Mono.fromCallable(this::loadSample);
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
    public Mono<SubmitTaskResult> SubmitTask(@RequestBody String json, ServerHttpResponse response){
        s_logger.info("Received: {}", json);
        return Mono.create(sink->{
            sink.onRequest(x->{
                try{
                    URL api = new URL(backEndServer, "/api/hello");
                    HttpRequest request = HttpRequest.newBuilder().uri(api.toURI()).build();
                    CompletableFuture<HttpResponse<String>> waitResp =  httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
                    waitResp.thenAccept(resp->{
                        response.setRawStatusCode(resp.statusCode());
                        sink.success(new SubmitTaskResult(0, resp.body()));
                    });
                }
                catch (MalformedURLException | URISyntaxException e){
                    sink.error(e);
                }
            });
        });
    }
}
