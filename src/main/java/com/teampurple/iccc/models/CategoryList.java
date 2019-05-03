package com.teampurple.iccc.models;
import java.util.*;

public class CategoryList {
    private List<String> categoryList;

    public CategoryList(List<String> categoryList) {
        this.categoryList = categoryList;
    }

    public List<String> getCategoryList() {
        return categoryList;
    }

    public void setCatagoryList(List<String> catagoryList) {
        this.categoryList = catagoryList;
    }
}
