package com.teampurple.iccc.models;

import java.util.List;

public class UserItem {
    private String username;
    private String bio;
    private String email;
    private String generalbase;
    private String thumbnail;
    private List<Category> userCategories;
    private List<Category> homeCategories;

    public String getgeneralbase() {
        return generalbase;
    }

    public void setgeneralbase(String generalbase) {
        this.generalbase = generalbase;
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

    public String getemail() {
        return email;
    }

    public void setemail(String email) {
        this.email = email;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public List<Category> getUserCategories() {
        return userCategories;
    }

    public void setUserCategories(List<Category> userCategories) {
        this.userCategories = userCategories;
    }

    public List<Category> getHomeCategories() {
        return homeCategories;
    }

    public void setHomeCategories(List<Category> homeCategories) {
        this.homeCategories = homeCategories;
    }
}
