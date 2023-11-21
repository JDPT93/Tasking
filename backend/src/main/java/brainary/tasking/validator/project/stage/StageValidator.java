package brainary.tasking.validator.project.stage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.stage.StagePayload;
import brainary.tasking.repository.project.stage.StageRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.stage.stage")
public class StageValidator {

	@Autowired
	private StageRepository stageRepository;

	public Boolean doesLeaderMatchById(Integer leaderId, Integer stageId) {
		return stageRepository.exists((stage, query, builder) -> {
			Join<?, ?> project = stage.join("project");
			Join<?, ?> leader = project.join("leader");
			Predicate equalId = builder.equal(stage.get("id"), stageId);
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			Predicate isActive = builder.isTrue(stage.get("active"));
			return builder.and(equalId, equalLeader, isActive);
		});
	}

	public Boolean isActive(Integer stageId) {
		return stageRepository.exists((stage, query, builder) -> {
			Predicate equalId = builder.equal(stage.get("id"), stageId);
			Predicate isActive = builder.isTrue(stage.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(StagePayload stagePayload) {
		return stageRepository.exists((stage, query, builder) -> {
			Join<?, ?> project = stage.join("project");
			Predicate equalProject = builder.equal(project.get("id"), stagePayload.getProject().getId());
			Predicate equalName = builder.equal(stage.get("name"), stagePayload.getName());
			Predicate isActive = builder.isTrue(stage.get("active"));
			if (stagePayload.getId() == null) {
				return builder.and(equalProject, equalName, isActive);
			}
			Predicate notEqualId = builder.notEqual(stage.get("id"), stagePayload.getId());
			return builder.and(notEqualId, equalProject, equalName, isActive);
		});
	}

}
