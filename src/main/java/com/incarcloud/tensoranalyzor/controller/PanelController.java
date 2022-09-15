package com.incarcloud.tensoranalyzor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="api")
public class PanelController {

    @GetMapping("hello")
    public String greeting(){
        return "Hello Spring!";
    }
}
