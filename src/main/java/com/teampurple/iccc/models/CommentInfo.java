package com.teampurple.iccc.models;

public class CommentInfo {

    private Comment comment;
    private GeneralBase authorGeneralBase;

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
