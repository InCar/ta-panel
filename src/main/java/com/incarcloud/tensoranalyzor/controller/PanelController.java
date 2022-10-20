package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.entities.SubmitTaskResult;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping(path="api")
public class PanelController {
    private static final Logger s_logger = LoggerFactory.getLogger(PanelController.class);
    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;

    // private WebClient webClient;

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
            System.err.println(ex.toString());
        }

        return sbJson.toString();
    }

    @PostMapping("submit-task")
    public Mono<SubmitTaskResult> SubmitTask(@RequestBody String json){
        s_logger.info("Received: {}", json);
        return Mono.fromCallable(()->new SubmitTaskResult());
    }
}
