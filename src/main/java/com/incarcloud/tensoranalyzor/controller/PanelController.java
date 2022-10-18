package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.entities.SubmitTaskResult;
import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping(path="api")
public class PanelController {
    private static final Logger s_logger = LoggerFactory.getLogger(PanelController.class);
    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;

    @GetMapping("hello")
    public String greeting(HttpServletResponse response){
        String json = loadSample();

        if(!FieldsExpr.Validate(json)){
            response.setStatus(HttpServletResponse.SC_PRECONDITION_FAILED);
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
    }

    @GetMapping("fields")
    public String getFields(){
        return loadSample();
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
    public SubmitTaskResult SubmitTask(@RequestBody String json){
        s_logger.info("Received: {}", json);
        return new SubmitTaskResult();
    }
}
