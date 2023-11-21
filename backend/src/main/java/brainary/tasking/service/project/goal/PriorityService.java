package brainary.tasking.service.project.goal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import brainary.tasking.repository.project.goal.PriorityRepository;
import brainary.tasking.payload.project.goal.PriorityPayload;
import jakarta.persistence.criteria.Predicate;

@Service(value = "project.goal.priority")
public class PriorityService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PriorityRepository priorityRepository;

	public Page<PriorityPayload> retrieveAll(Pageable pageable) {
		return priorityRepository.findAll((priority, query, builder) -> {
			Predicate isActive = builder.isTrue(priority.get("active"));
			return isActive;
		}, pageable)
			.map(priorityEntity -> modelMapper.map(priorityEntity, PriorityPayload.class));
	}

}
