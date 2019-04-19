package com.teampurple.iccc.models;

public class ContentInfo {

    private String type;
    private String title;
    private String description;
    private String parentSeries;
    private String parentEpisode;
    private String parentFrame;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParentSeries() {
        return parentSeries;
    }

    public void setParentSeries(String parentSeries) {
        this.parentSeries = parentSeries;
    }

    public String getParentEpisode() {
        return parentEpisode;
    }

    public void setParentEpisode(String parentEpisode) {
        this.parentEpisode = parentEpisode;
    }

    public String getParentFrame() {
        return parentFrame;
    }

    public void setParentFrame(String parentFrame) {
        this.parentFrame = parentFrame;
    }
}
