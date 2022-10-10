package com.incarcloud.tensoranalyzor.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RouteController {
    @RequestMapping(value = "/{path:TaskManager|NewAnalyzor|About}/**")
    public String redirect() {
        return "forward:/";
    }
}
