package team.bham.service.dto;

import java.time.*;

public class GroupDTO {
    private String groupID;
    private String groupName;
    private Integer groupPoints;
    private Duration timeLeft;
    private LocalDate creationDate;


    public GroupDTO(String groupID, String groupName, Integer groupPoints, Duration timeLeft, LocalDate creationDate) {
        this.groupID = groupID;
        this.groupName = groupName;
        this.groupPoints  = groupPoints;
        this.timeLeft = timeLeft;
        this.creationDate = creationDate;

    }

    public String getGroupID() {
        return groupID;
    }

    public void setGroupID(String groupID){
        this.groupID = groupID;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getGroupPoints() {
        return groupPoints;
    }

    public void setGroupPoints(Integer groupPoints) {
        this.groupPoints = groupPoints;
    }

    public Duration getTime() {
        return timeLeft;
    }

    public void setTime(Duration timeLeft) {
        this.timeLeft = timeLeft;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

}
