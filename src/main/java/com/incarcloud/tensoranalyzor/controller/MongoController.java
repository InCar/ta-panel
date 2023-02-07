package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.util.SubscriberHelpers;
import com.incarcloud.tensoranalyzor.vo.DataSheetVo;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Projections;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import com.mongodb.reactivestreams.client.MongoCollection;
import org.bson.Document;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "api/mongo")
public class MongoController implements Closeable {
    private final Logger s_logger = LoggerFactory.getLogger(MongoController.class);

    private final String _dbName = "ai";
    private final MongoClient _client;

    public MongoController(@Value("${tensor-analyzor.mongodb}") String mongodb) {
        this._client = MongoClients.create(mongodb);
    }

    @Override
    public void close() throws IOException {
        this._client.close();
    }

    @GetMapping("version")
    public Mono<String> Version() {
        Publisher<Document> publisher = this._client.getDatabase(this._dbName)
                .runCommand(new Document("buildInfo", 1));
        return Mono.from(publisher).map(r -> r.getString("version"));
    }

    @GetMapping("collections")
    public Mono<List<String>> GetCollections() {
        return Flux.from(this._client.getDatabase(this._dbName).listCollectionNames())
                .collectList();
    }

    @GetMapping("dataSheetSize")
    public Mono<DataSheetVo> getDataSheetSize(@RequestParam(value = "collectionName") String collectionName) {
        DataSheetVo vo = new DataSheetVo();
        SubscriberHelpers.PrintDocumentSubscriber subscriber1 = new SubscriberHelpers.PrintDocumentSubscriber();
        Publisher<Document> collStats = this._client.getDatabase(this._dbName).runCommand(new Document("collStats", collectionName));
        collStats.subscribe(subscriber1);
        subscriber1.await();
        List<Document> documents = subscriber1.get();
        if (!CollectionUtils.isEmpty(documents)) {
            Document document = documents.get(0);
            vo.setCollectionCount(document.getInteger("count"));
            vo.setCollectionSize(document.getDouble("size"));
        }
        return Mono.just(vo);
    }

    @GetMapping("dataSheetFields")
    public Mono<List<String>> getDataSheetFields(@RequestParam(value = "collectionName") String collectionName) {
        MongoCollection<Document> collection = this._client.getDatabase(this._dbName).getCollection(collectionName);
        SubscriberHelpers.PrintDocumentSubscriber subscriber = new SubscriberHelpers.PrintDocumentSubscriber();
        collection.find().projection(Projections.excludeId()).first().subscribe(subscriber);
        subscriber.await();
        List<Document> documents = subscriber.get();
        List<String> fields = new ArrayList<>();
        if (!CollectionUtils.isEmpty(documents)) {
            Document document = documents.get(0);
            fields.addAll(document.keySet());
        }
        return Mono.just(fields);
    }
}
