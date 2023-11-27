package brainary.tasking.validator.project.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.repository.project.goal.IssueRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.goal.issue")
public class IssueValidator {

	@Autowired
	private IssueRepository issueRepository;

	public Boolean isActive(Integer issueId) {
		return issueId == null ? true : issueRepository.exists((issue, query, builder) -> {
			Predicate equalId = builder.equal(issue.get("id"), issueId);
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(IssuePayload issuePayload) {
		return issueRepository.exists((issue, query, builder) -> {
			Join<?, ?> goal = issue.join("goal");
			Join<?, ?> project = goal.join("project");
			Join<?, ?> stage = goal.join("stage");
			// TODO: Check project
			Predicate equalProject = builder.equal(project.get("id"), issuePayload.getProject().getId());
			Predicate equalStage = builder.equal(stage.get("id"), issuePayload.getStage().getId());
			Predicate equalIndex = builder.equal(goal.get("index"), issuePayload.getIndex());
			Predicate equalName = builder.equal(goal.get("name"), issuePayload.getName());
			Predicate isActive = builder.isTrue(goal.get("active"));
			if (issuePayload.getId() == null) {
				return builder.and(equalProject, builder.or(builder.and(equalStage, equalIndex), equalName), isActive);
			}
			Predicate notEqualId = builder.notEqual(issue.get("id"), issuePayload.getId());
			return builder.and(notEqualId, equalProject, builder.or(builder.and(equalStage, equalIndex), equalName), isActive);
		});
	}

	public Boolean doesProjectLeaderMatchById(Integer leaderId, Integer goalId) {
		return issueRepository.exists((issue, query, builder) -> {
			Join<?, ?> project = issue.join("project");
			Join<?, ?> leader = project.join("leader");
			Predicate equalId = builder.equal(issue.get("id"), goalId);
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			return builder.and(equalId, equalLeader);
		});
	}

}
