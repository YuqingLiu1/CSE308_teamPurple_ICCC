package com.teampurple.iccc.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document
public class Sketch {
    @Id
    private String id;
    private String Thumbnail;
    @Field
    private String image;

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String Thumbnail() {
        return Thumbnail;
    }

    public void Thumbnail(String thumbnail) {
        this.Thumbnail = thumbnail;
    }


}
