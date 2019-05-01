package com.teampurple.iccc.models;

/**
 * Objects of this class represent linked information from various collections in the database. For instance, if an
 * object of this class is used to represent a user's information, then the generalBase field will contain the
 * GeneralBase for that user, the user field will contain the User for that user, the sketch field will contain the
 * Sketch for that user, and the contentBase field will be empty.
 */
public class AggregateInfo {

    // convenience field for determining the type ("User", "Series", "Episode", "Frame") of this AggregateInfo
    private String type;
    private GeneralBase generalBase;
    private ContentBase contentBase;
    private User user;
    private Sketch sketch;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public GeneralBase getGeneralBase() {
        return generalBase;
    }

    public void setGeneralBase(GeneralBase generalBase) {
        this.generalBase = generalBase;
    }

    public ContentBase getContentBase() {
        return contentBase;
    }

    public void setContentBase(ContentBase contentBase) {
        this.contentBase = contentBase;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Sketch getSketch() {
        return sketch;
    }

    public void setSketch(Sketch sketch) {
        this.sketch = sketch;
    }
}
