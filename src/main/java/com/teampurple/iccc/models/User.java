package com.teampurple.iccc.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "User")
public class User {
    @Id
    private String id;
    private String generalBaseRef;
    @Indexed(unique = true)
    private String email;
    private String password;
    private List<String> liked = new ArrayList<>();
    private List<String> content = new ArrayList<>();
    private List<String> userCategories = new ArrayList<>();
    private List<String> homeCategories = new ArrayList<>();

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

    public List<String> getLiked() {
        return liked;
    }

    public List<String> getContent() {
        return content;
    }

    public List<String> getUserCategories(){
        return userCategories;
    }

    public List<String> getHomeCategories(){
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

    public void setLiked(List<String> liked){
        this.liked = liked;
    }

    public void setHomeCategories(List<String> categories){
        this.homeCategories = categories;
    }

    public void setUserCategories(List<String> userCategories){
        this.userCategories = userCategories;
    }

    public void setContent(List<String> content){
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
