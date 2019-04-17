package com.teampurple.iccc.models;
import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document
public class Sketch {
    @Id
    private String id;
    private String GeneralBaseId;
    @Field
    private Binary image;

    public Binary getImage() {
        return image;
    }

    public void setImage(Binary image) {
        this.image = image;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGeneralBaseId() {
        return GeneralBaseId;
    }

    public void setGeneralBaseId(String generalBaseId) {
        GeneralBaseId = generalBaseId;
    }


}
