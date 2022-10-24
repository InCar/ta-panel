package com.incarcloud.tensoranalyzor.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.io.*;
import java.util.Scanner;


@RestController
public class RouteController {
    private final Logger s_logger = LoggerFactory.getLogger(RouteController.class);

    @RequestMapping("/{path:TaskManager|NewAnalyzor|About}/**")
    public Mono<String> SinglePageApp(@Value("${tensor-analyzor.index}") Resource html){
        try {
            Scanner s = new Scanner(html.getInputStream()).useDelimiter("\\A");
            String result = s.hasNext() ? s.next() : "";
            return Mono.just(result);
        }
        catch (IOException e){
            return Mono.just(e.getMessage());
        }
    }
}
