package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ContentBase")
public class ContentBase {

    // Note: for now, these have to agree with the strings used by the frontend, otherwise there could be
    // errors when trying to save to the database
    public static final String SERIES = "Series";
    public static final String EPISODE = "Episode";
    public static final String FRAME = "Frame";

    @Id
    private String id;
    private String generalBaseRef;
    private String author;
    private String type;
    private Boolean contributable;
    private Boolean _public;
    private Parents parents;

    public Parents getParents() {
        return parents;
    }

    public void setParents(Parents parents) {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
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

