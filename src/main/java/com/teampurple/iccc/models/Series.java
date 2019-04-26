package com.teampurple.iccc.models;

public class Series {

    private ContentBase contentBase;
    private GeneralBase generalBase;
    private Sketch sketch;

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
}
