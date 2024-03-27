package team.bham.service;

import team.bham.domain.Grouping;
import team.bham.repository.GroupingRepository;
import team.bham.service.dto.GroupDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.*;
import java.util.List;

@Service
@Transactional
public class GroupingService {

    private final GroupingRepository groupingRepository;

    public GroupingService(GroupingRepository groupingRepository) {
        this.groupingRepository = groupingRepository;
    }

    public Grouping save(Grouping group) {
        return groupingRepository.save(group);
    }

    @Transactional(readOnly = true)
    public List<Grouping> findAll() {
        return groupingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Grouping findOne(Long id) {
        return groupingRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        groupingRepository.deleteById(id);
    }

     /**
    @Transactional(readOnly = true)
    public List<GroupDTO> getGroupsByUserID(Long UserID) {
        return groupingRepository.findGroupsByUserID(UserID);
    }
    */

}
