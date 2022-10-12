package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.jsonexpr.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping(path="api")
public class PanelController {

    @Value("${tensor-analyzor.fields-file}")
    private String fieldsFile;

    @GetMapping("hello")
    public String greeting(){
        String json = loadSample();
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
}
