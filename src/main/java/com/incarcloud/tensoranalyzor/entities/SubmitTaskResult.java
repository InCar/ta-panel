package com.incarcloud.tensoranalyzor.entities;

public class SubmitTaskResult {
    private int code;
    private String message;

    public SubmitTaskResult(){
        this.code = 0;
        this.message = "Ok!";
    }

    public SubmitTaskResult(int code, String message){
        this.code = code;
        this.message = message;
    }

    public int getCode(){ return code; }
    public void setCode(int code){ this.code = code; }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
