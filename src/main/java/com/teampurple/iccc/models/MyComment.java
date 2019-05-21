package com.teampurple.iccc.models;

public class MyComment {

    private String content;



    private String title;

    public MyComment(String content, String onTitle) {
        this.content = content;
        this.title = onTitle;
    }


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


}
