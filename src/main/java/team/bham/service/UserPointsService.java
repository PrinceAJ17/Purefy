package team.bham.service;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import team.bham.domain.UserPoints;
import team.bham.repository.UserPointsRepository;

@Service
public class UserPointsService {

    @Autowired
    private UserPointsRepository userPointsRepository;

    @Scheduled(cron = "0 0 0 * * MON")
    @Transactional
    public void updatePoints() {
        List<UserPoints> allUserPoints = userPointsRepository.findAll();
        for (UserPoints userPoints : allUserPoints) {
            userPoints.setPreviousPoints(userPoints.getCurrentPoints());
            userPoints.setCurrentPoints(0);
        }
        userPointsRepository.saveAll(allUserPoints);
        System.out.println("User points updated");
    }
}
