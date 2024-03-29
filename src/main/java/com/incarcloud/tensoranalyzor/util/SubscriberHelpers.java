package com.incarcloud.tensoranalyzor.util;

import com.mongodb.MongoInterruptedException;
import org.bson.Document;
import org.reactivestreams.Subscriber;
import org.reactivestreams.Subscription;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

import static java.lang.String.format;


/**
 * @author xiaolan, created on 2023/2/6
 * @version 0.1.0-SNAPSHOT
 */
public final class SubscriberHelpers {

    /**
     * A Subscriber that stores the publishers results and provides a latch so can block on completion.
     *
     * @param <T> The publishers result type
     */
    public abstract static class ObservableSubscriber<T> implements Subscriber<T> {
        private final List<T> received;
        private final List<RuntimeException> errors;
        private final CountDownLatch latch;
        private volatile Subscription subscription;
        private volatile boolean completed;

        /**
         * Construct an instance
         */
        public ObservableSubscriber() {
            this.received = new ArrayList<>();
            this.errors = new ArrayList<>();
            this.latch = new CountDownLatch(1);
        }

        @Override
        public void onSubscribe(final Subscription s) {
            subscription = s;
        }

        @Override
        public void onNext(final T t) {
            received.add(t);
        }

        @Override
        public void onError(final Throwable t) {
            if (t instanceof RuntimeException) {
                errors.add((RuntimeException) t);
            } else {
                errors.add(new RuntimeException("Unexpected exception", t));
            }
            onComplete();
        }

        @Override
        public void onComplete() {
            completed = true;
            latch.countDown();
        }

        /**
         * Gets the subscription
         *
         * @return the subscription
         */
        public Subscription getSubscription() {
            return subscription;
        }

        /**
         * Get received elements
         *
         * @return the list of received elements
         */
        public List<T> getReceived() {
            return received;
        }

        /**
         * Get error from subscription
         *
         * @return the error, which may be null
         */
        public RuntimeException getError() {
            if (errors.size() > 0) {
                return errors.get(0);
            }
            return null;
        }

        /**
         * Get received elements.
         *
         * @return the list of receive elements
         */
        public List<T> get() {
            return await().getReceived();
        }

        /**
         * Get received elements.
         *
         * @param timeout how long to wait
         * @param unit    the time unit
         * @return the list of receive elements
         */
        public List<T> get(final long timeout, final TimeUnit unit) {
            return await(timeout, unit).getReceived();
        }

        /**
         * Await completion or error
         *
         * @return this
         */
        public ObservableSubscriber<T> await() {
            return await(60, TimeUnit.SECONDS);
        }

        /**
         * Await completion or error
         *
         * @param timeout how long to wait
         * @param unit    the time unit
         * @return this
         */
        public ObservableSubscriber<T> await(final long timeout, final TimeUnit unit) {
            subscription.request(Integer.MAX_VALUE);
            try {
                if (!latch.await(timeout, unit)) {

                    // throw new MongoTimeoutException("Publisher onComplete timed out");
                }
            } catch (InterruptedException e) {
                throw new MongoInterruptedException("Interrupted waiting for observeration", e);
            }
            if (!errors.isEmpty()) {
                throw errors.get(0);
            }
            return this;
        }
    }

    /**
     * A Subscriber that immediately requests Integer.MAX_VALUE onSubscribe
     * 添加,更新,删除订阅
     *
     * @param <T> The publishers result type
     */
    public static class OperationSubscriber<T> extends ObservableSubscriber<T> {

        @Override
        public void onSubscribe(final Subscription s) {
            super.onSubscribe(s);
            s.request(Integer.MAX_VALUE);
        }
    }

    /**
     * A Subscriber that prints a message including the received items on completion
     * 打印总记录数
     *
     * @param <T> The publishers result type
     */
    public static class PrintSubscriber<T> extends OperationSubscriber<T> {
        private final String message;

        /**
         * A Subscriber that outputs a message onComplete.
         *
         * @param message the message to output onComplete
         */
        public PrintSubscriber(final String message) {
            this.message = message;
        }

        @Override
        public void onComplete() {
            super.onComplete();
        }
    }

    /**
     * A Subscriber that prints the json version of each document
     * 查询集合订阅
     */
    public static class PrintDocumentSubscriber extends ConsumerSubscriber<Document> {
        /**
         * Construct a new instance
         */
        public PrintDocumentSubscriber() {
            super(Document::toJson);
        }
    }

    /**
     * A Subscriber that prints the toString version of each element
     *
     * @param <T> the type of the element
     */
    public static class PrintToStringSubscriber<T> extends ConsumerSubscriber<T> {
        /**
         * Construct a new instance
         */
        public PrintToStringSubscriber() {
            super(String::valueOf);
        }
    }

    /**
     * A Subscriber that processes a consumer for each element
     *
     * @param <T> the type of the element
     */
    public static class ConsumerSubscriber<T> extends OperationSubscriber<T> {
        private final Consumer<T> consumer;

        /**
         * Construct a new instance
         *
         * @param consumer the consumer
         */
        public ConsumerSubscriber(final Consumer<T> consumer) {
            this.consumer = consumer;
        }


        @Override
        public void onNext(final T document) {
            super.onNext(document);
            consumer.accept(document);
        }

    }

    private SubscriberHelpers() {
    }
}
