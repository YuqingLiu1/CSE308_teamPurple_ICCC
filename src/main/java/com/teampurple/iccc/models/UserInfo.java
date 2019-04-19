package com.teampurple.iccc.models;

public class UserInfo
{

    private String username;
    private String bio;
    private String email;
    private String password;

    public UserInfo(String username,String bio,String email,String password) {
        this.username = username;
        this.bio = bio;
        this.email = email;
        this.password = password;
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
}
