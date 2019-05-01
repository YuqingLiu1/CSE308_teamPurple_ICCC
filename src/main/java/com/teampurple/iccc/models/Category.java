package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.*;

@Document(collection = "Category")
public class Category {
    @Id
    private String id;
    // User ID of the user this category belongs to
    private String userRef;
    // the name of this category as it appears on the frontend
    private String name;
    // the type of content defined by this category; either "User", "Series", "Episode", "Frame", or null for all
    // content
    private String type;
    // User ID of the user who created the content found by this category
    private String creator;
    // the text used for searching in user names/bios and/or content titles/descriptions
    private String searchText;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserRef() {
        return userRef;
    }

    public void setUserRef(String userRef) {
        this.userRef = userRef;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getSearchText() {
        return searchText;
    }

    public void setSearchText(String searchText) {
        this.searchText = searchText;
    }
}
