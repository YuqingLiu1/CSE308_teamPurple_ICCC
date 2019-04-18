package com.teampurple.iccc.models;

public class Response {

    public static final String ERROR = "error";
    public static final String OK = "OK";

    private String status;
    private Object content;

    public Response(String status) {
        this(status, null);
    }

    public Response(String status, Object content) {
        this.status = status;
        this.content = content;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }
}
