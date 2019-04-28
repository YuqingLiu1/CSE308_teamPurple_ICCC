package com.teampurple.iccc.models;

public class Parents {

    // User ID of parent user
    private String user;
    // ContentBase ID of parent series, if there is one
    private String series;
    // ContentBase ID of parent episode, if there is one
    private String episode;
    // ContentBase ID of parent frame, if there is one
    private String frame;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getEpisode() {
        return episode;
    }

    public void setEpisode(String episode) {
        this.episode = episode;
    }

    public String getFrame() {
        return frame;
    }

    public void setFrame(String frame) {
        this.frame = frame;
    }
}
