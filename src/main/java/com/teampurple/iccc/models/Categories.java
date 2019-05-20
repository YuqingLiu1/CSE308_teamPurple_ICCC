package com.teampurple.iccc.models;

import java.util.List;

public class Categories {

    private List<String> homeCategoryIds;
    private List<String> userCategoryIds;

    public List<String> getHomeCategoryIds() {
        return homeCategoryIds;
    }

    public void setHomeCategoryIds(List<String> homeCategoryIds) {
        this.homeCategoryIds = homeCategoryIds;
    }

    public List<String> getUserCategoryIds() {
        return userCategoryIds;
    }

    public void setUserCategoryIds(List<String> userCategoryIds) {
        this.userCategoryIds = userCategoryIds;
    }
}
