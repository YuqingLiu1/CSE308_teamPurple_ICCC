package com.teampurple.iccc.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(collection = "User")
public class User {
    @Id
    private ObjectId id;
    private ObjectId generalBaseRef;
    private String email;
    private String password;
    private ArrayList<ObjectId> liked;
    private ArrayList<ObjectId> content;
    private ArrayList<ObjectId> userCategories;
    private ArrayList<ObjectId> homeCategories;

    public User(String email, String password) {
        // TODO: actually implement this constructor
        this.email = email;
        this.password = password;
    }

    public ObjectId getId(){
        return id;
    }

    public ObjectId getGeneralBaseRef(){
        return generalBaseRef;
    }

    public String getEmail(){ return email; }

    public String getPassword(){
        return password;
    }

    public ArrayList<ObjectId> getLiked() {
        return liked;
    }

    public ArrayList<ObjectId> getContent() {
        return content;
    }

    public ArrayList<ObjectId> getUserCategories(){
        return userCategories;
    }

    public ArrayList<ObjectId> getHomeCategories(){
        return homeCategories;
    }

    public void setGeneralBaseRef(ObjectId generalBaseRef){
        this.generalBaseRef = generalBaseRef;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setLiked(ArrayList<ObjectId> liked){
        this.liked = liked;
    }

    public void setHomeCategories(ArrayList<ObjectId> categories){
        this.homeCategories = categories;
    }

    public void setUserCategories(ArrayList<ObjectId> userCategories){
        this.userCategories = userCategories;
    }

    public void setContent(ArrayList<ObjectId> content){
        this.content = content;
    }

    @Override
    public String toString() {
        return String.format(
                "User[email='%s', password='%s']",
                email, password
        );
    }

}
