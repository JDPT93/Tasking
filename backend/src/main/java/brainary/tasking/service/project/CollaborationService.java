package brainary.tasking.service.project;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.CollaborationEntity;
import brainary.tasking.payload.project.CollaborationPayload;
import brainary.tasking.repository.project.CollaborationRepository;
import brainary.tasking.validator.project.CollaborationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.user.UserValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.collaboration")
public class CollaborationService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private CollaborationRepository collaborationRepository;

	@Autowired
	private CollaborationValidator collaborationValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private UserValidator userValidator;

	public CollaborationPayload create(CollaborationPayload collaborationPayload) {
		collaborationPayload.setId(null);
		collaborationPayload.setActive(true);
		if (!projectValidator.isActive(collaborationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
		}
		if (!userValidator.isActive(collaborationPayload.getCollaborator().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "user.not-found");
		}
		if (collaborationValidator.isConflicting(collaborationPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.collaboration.conflict");
		}
		return modelMapper.map(collaborationRepository.save(modelMapper.map(collaborationPayload, CollaborationEntity.class)), CollaborationPayload.class);
	}

	public Page<CollaborationPayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!projectValidator.isActive(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return collaborationRepository.findAll((collaboration, query, builder) -> {
			Join<?, ?> project = collaboration.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, CollaborationPayload.class));
	}

	public Page<CollaborationPayload> retrieveByCollaboratorId(Integer collaboratorId, Pageable pageable) {
		if (!userValidator.isActive(collaboratorId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		return collaborationRepository.findAll((collaboration, query, builder) -> {
			Join<?, ?> collaborator = collaboration.join("collaborator");
			Predicate equalCollaborator = builder.equal(collaborator.get("id"), collaboratorId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalCollaborator, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, CollaborationPayload.class));
	}

	public CollaborationPayload deleteById(Integer collaborationId) {
		return collaborationRepository.findOne((collaboration, query, builder) -> {
			Predicate equalId = builder.equal(collaboration.get("id"), collaborationId);
			Predicate isActive = builder.isTrue(collaboration.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(collaborationEntity -> {
				collaborationEntity.setActive(false);
				return modelMapper.map(collaborationRepository.save(collaborationEntity), CollaborationPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.collaboration.not-found"));
	}

}
