package com.teampurple.iccc.models;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.*;

@Document(collection = "Genre")
public class Genre {
    @Id
    private ObjectId id;
    private String name;
    private List<ObjectId> series;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ObjectId> getSeries() {
        return series;
    }

    public void setSeries(List<ObjectId> series) {
        this.series = series;
    }
}
