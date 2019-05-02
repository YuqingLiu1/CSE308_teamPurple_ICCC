package com.teampurple.iccc.models;

public class NewCategoryItem {

    public static final String HOME_LOCATION = "Home";
    public static final String USER_LOCATION = "User";
    public static final String ALL_TYPE = "All";

    private String location;
    private String name;
    private String type;
    private String creator;
    private String searchText;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
