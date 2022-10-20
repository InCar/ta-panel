package com.incarcloud.tensoranalyzor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.context.WebServerApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@SpringBootApplication
public class Application implements CommandLineRunner {
    private final static Logger s_logger = LoggerFactory.getLogger(Application.class);
    @Autowired
    private WebServerApplicationContext webAppCtx;
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        s_logger.info("WebServer is listening on: {}", webAppCtx.getWebServer().getPort());
    }

    @Bean
    public WebFluxConfigurer corsConfigurer() {
        return new WebFluxConfigurer() {
            @Value("${tensor-analyzor.allow-cors}")
            private String cors;
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                if(this.cors != null)
                    registry.addMapping("/api/**").allowedOrigins(this.cors);
            }
        };
    }
}
