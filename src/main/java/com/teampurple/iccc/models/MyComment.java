package com.teampurple.iccc.models;

public class MyComment {

    private String content;



    private String title;



    private String generalBaseId;

    public MyComment(String content, String onTitle, String gbid) {
        this.content = content;
        this.title = onTitle;
        this.generalBaseId = gbid;
    }

    public String getGeneralBaseId() {
        return generalBaseId;
    }

    public void setGeneralBaseId(String generalBaseId) {
        this.generalBaseId = generalBaseId;
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
