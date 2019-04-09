package com.teampurple.iccc.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;

@Document(collection = "GeneralBase")
public class GeneralBase {
    @Id
    private ObjectId id;
    private ObjectId typeRef;
    private String type;
    private ObjectId sketch;
    private String title;
    private String description;
    private Date creationDate;
    private ArrayList<ObjectId> children;
    private ArrayList<ObjectId> likers;
    private ArrayList<ObjectId> comments;


    public void setTypeRef(ObjectId typeRef){
        this.typeRef = typeRef;
    }

    public void setType(String type){
        this.type = type;
    }

    public void setSketch(ObjectId sketch){
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

    public void setChildren(ArrayList<ObjectId> children){
        this.children = children;
    }

    public void setLikers(ArrayList<ObjectId> likers){
        this.likers = likers;
    }

    public void setComments(ArrayList<ObjectId> comments){
        this.comments = comments;
    }

    public ObjectId getId(){
        return id;
    }

    public ObjectId getTypeRef(){
        return typeRef;
    }

    public String getType(){
        return type;
    }

    public ObjectId getSketch(){
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

    public ArrayList<ObjectId> getChildren(){
        return children;
    }

    public ArrayList<ObjectId> getLikers(){
        return likers;
    }

    public ArrayList<ObjectId> getComments(){
        return comments;
    }

}
