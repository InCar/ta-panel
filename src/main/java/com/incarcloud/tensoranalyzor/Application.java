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

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@SpringBootApplication
public class Application implements CommandLineRunner {
    private final static Logger s_logger = LoggerFactory.getLogger(Application.class);

    public final static long s_tmStart = System.currentTimeMillis();

    @Autowired
    private WebServerApplicationContext webAppCtx;
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        GitVer version = new GitVer();
        s_logger.info("WebServer (version: {}) is listening on \033[0;34m{}\033[0m\033[0;96m:{}\033[0m",
                version.getVersion(),
                "http://127.0.0.1",
                webAppCtx.getWebServer().getPort());

        writePidFile();

        Runtime.getRuntime().addShutdownHook(new Thread(()->{
            removePidFile();
            s_logger.info("Quit.");
        }));
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

    private final String _pidFolder = "/var/tmp";
    private final String _pidFileName = "ta-panel.pid";

    private void writePidFile(){
        if(Files.exists(Path.of(_pidFolder))){
            File fPid = null;
            try {
                fPid = Path.of(_pidFolder, _pidFileName).toFile();
                FileWriter writer = new FileWriter(fPid, false);
                writer.write(Long.toString(ProcessHandle.current().pid()));
                writer.close();
            }catch (IOException e){
                s_logger.warn("write pid file {} failed: {}", fPid.getPath(), e.getMessage());
            }
        }
    }

    private void removePidFile(){
        Path path = Path.of(_pidFolder, _pidFileName);
        if(Files.exists(path)){
            try {
                path.toFile().delete();
            }catch (SecurityException e){
                s_logger.warn("delete pid file {} failed: {}", path, e.getMessage());
            }

        }
    }
}
