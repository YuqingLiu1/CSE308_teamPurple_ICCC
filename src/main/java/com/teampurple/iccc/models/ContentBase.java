package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ContentBase")
public class ContentBase {
    @Id
    private String id;
    private String generalBaseRef;
    private String author;
    private Type type;
    private Boolean contributable;
    private Boolean _public;
    private Parents parents;

    public Parents getParent() {
        return parents;
    }

    public void setParent(Parents parents) {
        this.parents = parents;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGeneralBaseRef() {
        return generalBaseRef;
    }

    public void setGeneralBaseRef(String generalBaseRef) {
        this.generalBaseRef = generalBaseRef;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
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

    public Boolean getPublic() {
        return _public;
    }

    public void setPublic(Boolean publication) {
        this._public = publication;
    }
}

enum Type {
    Series, Episode, Frame;
}

class Parents {
    private String user;
    private String series;
    private String episode;
    private String frame;

    public Parents() {
        this.user= null;
        this.series=null;
        this.episode=null;
        this.frame=null;

    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getEpisode() {
        return episode;
    }

    public void setEpisode(String episode) {
        this.episode = episode;
    }

    public String getFrame() {
        return frame;
    }

    public void setFrame(String frame) {
        this.frame = frame;
    }
}