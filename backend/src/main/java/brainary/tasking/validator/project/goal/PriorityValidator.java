package brainary.tasking.validator.project.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.repository.project.goal.PriorityRepository;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.goal.priority")
public class PriorityValidator {

	@Autowired
	private PriorityRepository priorityRepository;

	public Boolean isActive(Integer priorityId) {
		return priorityRepository.exists((priority, query, builder) -> {
			Predicate equalId = builder.equal(priority.get("id"), priorityId);
			Predicate isActive = builder.isTrue(priority.get("active"));
			return builder.and(equalId, isActive);
		});
	}

}
