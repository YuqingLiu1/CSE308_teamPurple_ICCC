package com.teampurple.iccc.models;

public class SurroundingContent {

    private String parentContentBaseRef;
    private String childContentBaseRef;
    private String leftContentBaseRef;
    private String rightContentBaseRef;

    public String getParentContentBaseRef() {
        return parentContentBaseRef;
    }

    public void setParentContentBaseRef(String parentContentBaseRef) {
        this.parentContentBaseRef = parentContentBaseRef;
    }

    public String getChildContentBaseRef() {
        return childContentBaseRef;
    }

    public void setChildContentBaseRef(String childContentBaseRef) {
        this.childContentBaseRef = childContentBaseRef;
    }

    public String getLeftContentBaseRef() {
        return leftContentBaseRef;
    }

    public void setLeftContentBaseRef(String leftContentBaseRef) {
        this.leftContentBaseRef = leftContentBaseRef;
    }

    public String getRightContentBaseRef() {
        return rightContentBaseRef;
    }

    public void setRightContentBaseRef(String rightContentBaseRef) {
        this.rightContentBaseRef = rightContentBaseRef;
    }
}
