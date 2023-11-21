package brainary.tasking.validator.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.ProjectPayload;
import brainary.tasking.repository.project.ProjectRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.project")
public class ProjectValidator {

	@Autowired
	private ProjectRepository projectRepository;

	public Boolean doesLeaderMatchById(Integer leaderId, Integer projectId) {
		return projectRepository.exists((project, query, builder) -> {
			Join<?, ?> leader = project.join("leader");
			Predicate equalId = builder.equal(project.get("id"), projectId);
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalId, equalLeader, isActive);
		});
	}

	public Boolean isActive(Integer projectId) {
		return projectRepository.exists((project, query, builder) -> {
			Predicate equalId = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(ProjectPayload projectPayload) {
		return projectRepository.exists((project, query, builder) -> {
			Join<?, ?> leader = project.join("leader");
			Predicate equalLeader = builder.equal(leader.get("id"), projectPayload.getLeader().getId());
			Predicate equalName = builder.equal(project.get("name"), projectPayload.getName());
			Predicate isActive = builder.isTrue(project.get("active"));
			if (projectPayload.getId() == null) {
				return builder.and(equalLeader, equalName, isActive);
			}
			Predicate notEqualId = builder.notEqual(project.get("id"), projectPayload.getId());
			return builder.and(notEqualId, equalLeader, equalName, isActive);
		});
	}

}
