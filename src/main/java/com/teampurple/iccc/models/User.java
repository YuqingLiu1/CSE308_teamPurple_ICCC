package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(collection = "User")
public class User {
    @Id
    private String id;
    private String generalBaseRef;
    @Indexed(unique = true)
    private String email;
    private String password;
    private ArrayList<String> liked;
    private ArrayList<String> content;
    private ArrayList<String> userCategories;
    private ArrayList<String> homeCategories;

    public User(String email, String password) {
        // TODO: actually implement this constructor
        this.email = email;
        this.password = password;
    }

    public String getId(){
        return id;
    }

    public String getGeneralBaseRef(){
        return generalBaseRef;
    }

    public String getEmail(){ return email; }

    public String getPassword(){ return password; }

    public ArrayList<String> getLiked() {
        return liked;
    }

    public ArrayList<String> getContent() {
        return content;
    }

    public ArrayList<String> getUserCategories(){
        return userCategories;
    }

    public ArrayList<String> getHomeCategories(){
        return homeCategories;
    }

    public void setGeneralBaseRef(String generalBaseRef){
        this.generalBaseRef = generalBaseRef;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setLiked(ArrayList<String> liked){
        this.liked = liked;
    }

    public void setHomeCategories(ArrayList<String> categories){
        this.homeCategories = categories;
    }

    public void setUserCategories(ArrayList<String> userCategories){
        this.userCategories = userCategories;
    }

    public void setContent(ArrayList<String> content){
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
