package brainary.tasking.validator.project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.CollaborationPayload;
import brainary.tasking.repository.project.CollaborationRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.collaboration")
public class CollaborationValidator {

	@Autowired
	private CollaborationRepository collaborationRepository;

	public Boolean doesCollaboratorMatchById(Integer collaboratorId, Integer collaborationId) {
		return collaborationRepository.exists((collaboration, query, builder) -> {
			Join<?, ?> collaborator = collaboration.join("collaborator");
			Predicate equalProject = builder.equal(collaboration.get("id"), collaborationId);
			Predicate equalCollaborator = builder.equal(collaborator.get("id"), collaboratorId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalProject, equalCollaborator, isActive);
		});
	}

	public Boolean doesCollaboratorMatchByProjectId(Integer collaboratorId, Integer projectId) {
		return collaborationRepository.exists((collaboration, query, builder) -> {
			Join<?, ?> project = collaboration.join("project");
			Join<?, ?> collaborator = collaboration.join("collaborator");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate equalCollaborator = builder.equal(collaborator.get("id"), collaboratorId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalProject, equalCollaborator, isActive);
		});
	}

	public Boolean isActive(Integer collaborationId) {
		return collaborationRepository.exists((collaboration, query, builder) -> {
			Predicate equalId = builder.equal(collaboration.get("id"), collaborationId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(CollaborationPayload collaborationPayload) {
		return collaborationRepository.exists((collaboration, query, builder) -> {
			Predicate equalProject = builder.equal(collaboration.get("project"), collaborationPayload.getProject().getId());
			Predicate equalCollaborator = builder.equal(collaboration.get("collaborator"), collaborationPayload.getCollaborator().getId());
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			if (collaborationPayload.getId() == null) {
				return builder.and(equalProject, equalCollaborator, isActive);
			}
			Predicate notEqualId = builder.notEqual(collaboration.get("id"), collaborationPayload.getId());
			return builder.and(notEqualId, equalProject, equalCollaborator, isActive);
		});
	}

}
