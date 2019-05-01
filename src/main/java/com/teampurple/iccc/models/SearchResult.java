package com.teampurple.iccc.models;

import java.util.List;

public class SearchResult {

    private List<AggregateInfo> users;
    private List<AggregateInfo> series;
    private List<AggregateInfo> episodes;
    private List<AggregateInfo> frames;

    public List<AggregateInfo> getUsers() {
        return users;
    }

    public void setUsers(List<AggregateInfo> users) {
        this.users = users;
    }

    public List<AggregateInfo> getSeries() {
        return series;
    }

    public void setSeries(List<AggregateInfo> series) {
        this.series = series;
    }

    public List<AggregateInfo> getEpisodes() {
        return episodes;
    }

    public void setEpisodes(List<AggregateInfo> episodes) {
        this.episodes = episodes;
    }

    public List<AggregateInfo> getFrames() {
        return frames;
    }

    public void setFrames(List<AggregateInfo> frames) {
        this.frames = frames;
    }
}
