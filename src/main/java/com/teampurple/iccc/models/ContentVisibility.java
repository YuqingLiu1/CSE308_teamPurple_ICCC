package com.teampurple.iccc.models;

public class ContentVisibility {

    private Boolean isPublic;
    private Boolean isContributable;

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public Boolean getContributable() {
        return isContributable;
    }

    public void setContributable(Boolean contributable) {
        isContributable = contributable;
    }
}
