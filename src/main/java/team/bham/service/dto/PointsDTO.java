package team.bham.service.dto;

public class PointsDTO {
    private String username;
    private Integer currentPoints;
    private Integer previousPoints;
    private Integer totalPoints;


    public PointsDTO(String username, Integer currentPoints, Integer previousPoints, Integer totalPoints) {
        this.username = username;
        this.currentPoints = currentPoints;
        this.previousPoints = previousPoints;
        this.totalPoints = totalPoints;

    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getCurrentPoints() {
        return currentPoints;
    }

    public void setCurrentPoints(Integer currentPoints) {
        this.currentPoints = currentPoints;
    }

    public Integer getPreviousPoints() {
        return previousPoints;
    }

    public void setPreviousPoints(Integer previousPoints) {
        this.previousPoints = previousPoints;
    }

    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

}
