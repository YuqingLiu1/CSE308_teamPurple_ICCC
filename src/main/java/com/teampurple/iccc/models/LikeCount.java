package com.teampurple.iccc.models;

public class LikeCount {

    private String generalBaseId;
    private Integer numLikes;

    public String getGeneralBaseId() {
        return generalBaseId;
    }

    public void setGeneralBaseId(String generalBaseId) {
        this.generalBaseId = generalBaseId;
    }

    public Integer getNumLikes() {
        return numLikes;
    }

    public void setNumLikes(Integer numLikes) {
        this.numLikes = numLikes;
    }
}
