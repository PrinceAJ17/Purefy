package team.bham.service;

import team.bham.domain.Members;
import team.bham.repository.MembersRepository;
import team.bham.service.dto.PointsDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.*;
import java.util.List;

@Service
@Transactional
public class MembersService {

    private final MembersRepository membersRepository;

    public MembersService(MembersRepository membersRepository) {
        this.membersRepository = membersRepository;
    }

    public Members save(Members member) {
        return membersRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<Members> findAll() {
        return membersRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Members findOne(Long id) {
        return membersRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        membersRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PointsDTO> getPointsByGroupID(Long groupId) {
        return membersRepository.findPointsByGroupID(groupId);
    }


}
