package com.teampurple.iccc.models;

import java.util.List;

public class UserInfo
{

    private String username;
    private String bio;
    private String email;
    private String password;
    private String sketchRef;
    private List<Category> userCategories;
    private List<Category> homeCategories;

    public List<Category> getHomeCategories() {
        return homeCategories;
    }

    public void setHomeCategories(List<Category> homeCategories) {
        this.homeCategories = homeCategories;
    }

    public List<Category> getUserCategories() {
        return userCategories;
    }

    public void setUserCategories(List<Category> userCategories) {
        this.userCategories = userCategories;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSketchRef() { return sketchRef; }

    public void setSketchRef(String sketchRef) { this.sketchRef = sketchRef; }
}
