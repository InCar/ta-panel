package com.incarcloud.tensoranalyzor.controller;

import com.mongodb.reactivestreams.client.MongoClient;
import org.bson.Document;
import org.reactivestreams.Publisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import com.mongodb.reactivestreams.client.MongoClients;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Closeable;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path="api/mongo")
public class MongoController implements Closeable {
    private final String _dbName = "ai";
    private final MongoClient _client;

    public MongoController(@Value("${tensor-analyzor.mongodb}") String mongodb){
        this._client = MongoClients.create(mongodb);
    }

    @Override
    public void close() throws IOException {
        this._client.close();
    }

    @GetMapping("version")
    public Mono<String> Version(){
        Publisher<Document> publisher = this._client.getDatabase(this._dbName)
                .runCommand(new Document("buildInfo", 1));
        return Mono.from(publisher).map(r->r.getString("version"));
    }

    @GetMapping("collections")
    public Mono<List<String>> GetCollections(){
        return Flux.from(this._client.getDatabase(this._dbName).listCollectionNames())
                .collectList();
    }
}
