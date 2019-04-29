package com.teampurple.iccc.models;

public class ContentInfo {

    // ContentBase ID of this content
    private String id;
    private String type;
    private String title;
    private String description;
    // ContentBase ID of parent series, if there is one
    private String parentSeries;
    // ContentBase ID of parent episode, if there is one
    private String parentEpisode;
    // ContentBase ID of parent frame, if there is one
    private String parentFrame;
    private Boolean contributable;
    private Boolean _public;

    private Sketch sketch;
    private GeneralBase generalBase;
    private ContentBase contentBase;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Boolean getContributable() {
        return contributable;
    }

    public void setContributable(Boolean contributable) {
        this.contributable = contributable;
    }

    public Boolean getPublic() {
        return _public;
    }

    public void setPublic(Boolean _public) {
        this._public = _public;
    }

    public Sketch getSketch() {
        return sketch;
    }

    public void setSketch(Sketch sketch) {
        this.sketch = sketch;
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
