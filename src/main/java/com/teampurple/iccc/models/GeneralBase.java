package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

@Document(collection = "GeneralBase")
public class GeneralBase {
    @Id
    private String id;
    private String typeRef;
    private String type;
    private String sketch;
    private String title;
    private String description;
    private Date creationDate;
    private String thumbnail;
    private ArrayList<String> children;
    private ArrayList<String> likers;
    private ArrayList<String> comments;


    public void setTypeRef(String typeRef){
        this.typeRef = typeRef;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setSketch(String sketch){
        this.sketch = sketch;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public void setCreationDate(Date date){
        creationDate = date;
    }

    public void setChildren(ArrayList<String> children){
        this.children = children;
    }

    public void setLikers(ArrayList<String> likers){
        this.likers = likers;
    }

    public void setComments(ArrayList<String> comments){
        this.comments = comments;
    }

    public String getId(){
        return id;
    }

    public String getTypeRef(){
        return typeRef;
    }

    public String getType(){
        return type;
    }

    public String getSketch(){
        return sketch;
    }

    public String getTitle(){
        return title;
    }

    public String getDescription(){
        return description;
    }

    public Date creationDate(){
        return creationDate;
    }

    public ArrayList<String> getChildren(){
        return children;
    }

    public ArrayList<String> getLikers(){
        return likers;
    }

    public ArrayList<String> getComments(){
        return comments;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

}
