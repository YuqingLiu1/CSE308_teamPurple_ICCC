package com.teampurple.iccc.models;

public class NewComment {
    private String on;

    private String author;

    private String content;


    public NewComment(String on, String author, String content){
        this.on = on;
        this.author = author;
        this.content = content;
    }

    public String getOn() {
        return on;
    }

    public void setOn(String on) {
        this.on = on;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
