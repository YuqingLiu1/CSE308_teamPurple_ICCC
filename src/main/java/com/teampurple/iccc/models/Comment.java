package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Comment")
public class Comment {
    @Id
    private String id;
    private String on;
    private String author;
    private String content;

    public String getOn(){
        return on;
    }

    public String getAuthor(){
        return author;
    }

    public String getContent(){
        return content;
    }

    public void setOn(String on){
        this.on = on;
    }

    public void setAuthor(String author){
        this.author = author;
    }

    public void setContent(String content){
        this.content = content;

    }
}
