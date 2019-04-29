package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

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
    private Boolean _public;   // note that the underscore here is just to avoid conflict with the keyword "public";
                               // it still shows up as "public" when sent through an HTTP request/response
    private Parents parents;
    private Date dateMadeContributable;
    private Date dateMadePublic;

    public Date getDateMadeContributable() {
        return dateMadeContributable;
    }

    public void setDateMadeContributable(Date dateMadeContributable) {
        this.dateMadeContributable = dateMadeContributable;
    }

    public Date getDateMadePublic() {
        return dateMadePublic;
    }

    public void setDateMadePublic(Date dateMadePublic) {
        this.dateMadePublic = dateMadePublic;
    }

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

    public void setPublic(Boolean _public) {
        this._public = _public;
    }
}

