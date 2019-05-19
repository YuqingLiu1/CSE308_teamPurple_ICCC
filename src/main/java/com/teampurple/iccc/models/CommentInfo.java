package com.teampurple.iccc.models;

public class CommentInfo {

    private Comment comment;
    private GeneralBase authorGeneralBase;
    private Sketch authorSketch;

    public Sketch getAuthorSketch() {
        return authorSketch;
    }

    public void setAuthorSketch(Sketch authorSketch) {
        this.authorSketch = authorSketch;
    }

    public GeneralBase getAuthorGeneralBase() {
        return authorGeneralBase;
    }

    public void setAuthorGeneralBase(GeneralBase authorGeneralBase) {
        this.authorGeneralBase = authorGeneralBase;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
