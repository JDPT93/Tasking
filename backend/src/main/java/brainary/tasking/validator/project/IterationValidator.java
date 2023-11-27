package brainary.tasking.validator.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.entity.project.IterationEntity;
import brainary.tasking.entity.project.ProjectEntity;
import brainary.tasking.entity.user.UserEntity;
import brainary.tasking.payload.project.IterationPayload;
import brainary.tasking.repository.project.IterationRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.project.iteration")
public class IterationValidator {

	@Autowired
	private IterationRepository iterationRepository;

	public Boolean doesProjectLeaderMatchById(Integer leaderId, Integer iterationId) {
		return iterationRepository.exists((iteration, query, builder) -> {
			Join<IterationEntity, ProjectEntity> project = iteration.join("project");
			Join<ProjectEntity, UserEntity> leader = project.join("leader");
			Predicate equalId = builder.equal(iteration.get("id"), iterationId);
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			return builder.and(equalId, equalLeader);
		});
	}

	public Boolean isActive(Integer iterationId) {
		return iterationRepository.exists((iteration, query, builder) -> {
			Predicate equalId = builder.equal(iteration.get("id"), iterationId);
			Predicate isActive = builder.isTrue(iteration.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(IterationPayload iterationPayload) {
		return iterationRepository.exists((iteration, query, builder) -> {
			Predicate equalProject = builder.equal(iteration.get("project").get("id"), iterationPayload.getProject().getId());
			Predicate equalName = builder.equal(iteration.get("name"), iterationPayload.getName());
			Predicate isActive = builder.isTrue(iteration.get("active"));
			return builder.and(equalProject, equalName, isActive);
		});
	}

}
