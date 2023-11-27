package brainary.tasking.validator.project.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.goal.GoalPayload;
import brainary.tasking.repository.project.goal.GoalRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.goal.goal")
public class GoalValidator {

	@Autowired
	private GoalRepository goalRepository;

	public Boolean isActive(Integer goalId) {
		return goalRepository.exists((goal, query, builder) -> {
			Predicate equalId = builder.equal(goal.get("id"), goalId);
			Predicate isActive = builder.isTrue(goal.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(GoalPayload goalPayload) {
		return goalRepository.exists((goal, query, builder) -> {
			Join<?, ?> project = goal.join("project");
			Predicate equalProject = builder.equal(project.get("id"), goalPayload.getProject().getId());
			Predicate equalIndex = builder.equal(goal.get("index"), goalPayload.getIndex());
			Predicate equalName = builder.equal(goal.get("name"), goalPayload.getName());
			Predicate isActive = builder.isTrue(goal.get("active"));
			if (goalPayload.getId() == null) {
				return builder.and(equalProject, builder.or(equalIndex, equalName), isActive);
			}
			Predicate notEqualId = builder.notEqual(goal.get("id"), goalPayload.getId());
			return builder.and(notEqualId, equalProject, builder.or(equalIndex, equalName), isActive);
		});
	}

	public Boolean doesProjectLeaderMatchById(Integer leaderId, Integer goalId) {
		return goalRepository.exists((goal, query, builder) -> {
			Join<?, ?> project = goal.join("project");
			Join<?, ?> leader = project.join("leader");
			Predicate equalId = builder.equal(goal.get("id"), goalId);
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			return builder.and(equalId, equalLeader);
		});
	}

}
