package com.teampurple.iccc.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "ContentBase")
enum Type{
    Series,Episode,Frame;
}
class Parent{
    private ObjectId user;
    private ObjectId series;
    private ObjectId episode;
    private ObjectId frame;
    public Parent(){
        this.user= null;
        this.series=null;
        this.episode=null;
        this.frame=null;

    }

    public ObjectId getUser() {
        return user;
    }

    public void setUser(ObjectId user) {
        this.user = user;
    }

    public ObjectId getSeries() {
        return series;
    }

    public void setSeries(ObjectId series) {
        this.series = series;
    }

    public ObjectId getEpisode() {
        return episode;
    }

    public void setEpisode(ObjectId episode) {
        this.episode = episode;
    }

    public ObjectId getFrame() {
        return frame;
    }

    public void setFrame(ObjectId frame) {
        this.frame = frame;
    }
}
public class ContentBase {
    @Id
    private ObjectId id;
    private ObjectId generalBase;
    private ObjectId author;
    private Type type;
    private Boolean contributable;
    private Boolean publication;
    private Parent parent;

    public Parent getParent() {
        return parent;
    }

    public void setParent(Parent parent) {
        this.parent = parent;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getGeneralBase() {
        return generalBase;
    }

    public void setGeneralBase(ObjectId generalBase) {
        this.generalBase = generalBase;
    }

    public ObjectId getAuthor() {
        return author;
    }

    public void setAuthor(ObjectId author) {
        this.author = author;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Boolean getContributable() {
        return contributable;
    }

    public void setContributable(Boolean contributable) {
        this.contributable = contributable;
    }

    public Boolean getPublication() {
        return publication;
    }

    public void setPublication(Boolean publication) {
        this.publication = publication;
    }

}
