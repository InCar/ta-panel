package com.incarcloud.tensoranalyzor.controller;

import com.incarcloud.tensoranalyzor.util.SubscriberHelpers;
import com.incarcloud.tensoranalyzor.vo.DataSheetVo;
import com.incarcloud.tensoranalyzor.vo.TaskSchemaRequest;
import com.incarcloud.tensoranalyzor.vo.TaskSchemaResponse;
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
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @GetMapping("collectionSheetSize")
    public Mono<List<DataSheetVo>> getDataSheetSize() {
        List<DataSheetVo> list = new ArrayList<>();
        //先获取所有表
        Publisher<String> collectionNames = this._client.getDatabase(this._dbName).listCollectionNames();
        SubscriberHelpers.PrintToStringSubscriber<String> stringSubscriber = new SubscriberHelpers.PrintToStringSubscriber<>();
        collectionNames.subscribe(stringSubscriber);
        stringSubscriber.await();
        List<String> names = stringSubscriber.get();
        //根据表名获取每张表的信息
        for (String name : names) {
            SubscriberHelpers.PrintDocumentSubscriber subscriber = new SubscriberHelpers.PrintDocumentSubscriber();
            DataSheetVo vo = new DataSheetVo();
            vo.setCollectionName(name);
            //循环获取表的行数和大小
            Publisher<Document> collStats = this._client.getDatabase(this._dbName).runCommand(new Document("collStats", name));
            collStats.subscribe(subscriber);
            subscriber.await();
            List<Document> documents = subscriber.get();
            if (!CollectionUtils.isEmpty(documents)) {
                Document document = documents.get(0);
                Optional.ofNullable(document.get("count")).ifPresent(e -> vo.setCollectionCount(Long.parseLong(e.toString())));
                double size = document.get("size") == null ? 0 : Double.parseDouble(document.get("size").toString());
                //将字节转换为MB
                if (size > 0) {
                    vo.setCollectionSize(size / (1024 * 1024));
                }
                list.add(vo);
            }
        }
        return Mono.just(list);
    }

    @GetMapping("collectionSheetFields")
    public Mono<List<String>> getDataSheetFields(@RequestParam(value = "collectionName") String collectionName) {
        MongoCollection<Document> collection = this._client.getDatabase(this._dbName).getCollection(collectionName);
        SubscriberHelpers.PrintDocumentSubscriber subscriber = new SubscriberHelpers.PrintDocumentSubscriber();
        //获取表字段，暂时先取第一行数据字段，去除ID
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

    @PostMapping("task-schema")
    public Mono<TaskSchemaResponse> taskSchema(@RequestBody TaskSchemaRequest request) {
        //todo 调用实际逻辑
        return Mono.just(new TaskSchemaResponse());
    }
}
