package brainary.tasking.service.project;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.CollaborationEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.CollaborationPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.repository.project.CollaborationRepository;
import brainary.tasking.repository.project.ProjectRepository;
import brainary.tasking.repository.user.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.collaboration")
public class CollaborationService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private CollaborationRepository collaborationRepository;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private UserRepository userRepository;

	private Boolean isActiveProject(Integer projectId) {
		return projectRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isActiveUser(Integer userId) {
		return userRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), userId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isConflictingCollaboration(CollaborationPayload collaborationPayload) {
		return collaborationRepository.exists((root, query, builder) -> {
			Join<?, ?> project = root.join("project");
			Join<?, ?> collaborator = root.join("collaborator");
			Predicate equalProject = builder.equal(project.get("id"), collaborationPayload.getProject().getId());
			Predicate equalCollaborator = builder.equal(collaborator.get("id"), collaborationPayload.getCollaborator().getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (collaborationPayload.getId() == null) {
				return builder.and(equalProject, equalCollaborator, isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), collaborationPayload.getId());
			return builder.and(notEqualId, equalProject, equalCollaborator, isActive);
		});
	}

	public CollaborationPayload create(CollaborationPayload collaborationPayload) {
		collaborationPayload.setId(null);
		collaborationPayload.setActive(true);
		if (!isActiveProject(collaborationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
		}
		if (!isActiveUser(collaborationPayload.getCollaborator().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "user.not-found");
		}
		if (isConflictingCollaboration(collaborationPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.collaboration.conflict");
		}
		return modelMapper.map(collaborationRepository.save(modelMapper.map(collaborationPayload, CollaborationEntity.class)), CollaborationPayload.class);
	}

	public Page<IssuePayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!isActiveProject(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return collaborationRepository.findAll((root, query, builder) -> {
			Join<?, ?> project = root.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public Page<IssuePayload> retrieveByCollaboratorId(Integer collaboratorId, Pageable pageable) {
		if (!isActiveUser(collaboratorId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		return collaborationRepository.findAll((root, query, builder) -> {
			Join<?, ?> collaborator = root.join("collaborator");
			Predicate equalCollaborator = builder.equal(collaborator.get("id"), collaboratorId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalCollaborator, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public ChangelogPayload<CollaborationPayload> update(CollaborationPayload collaborationPayload) {
		if (!isActiveProject(collaborationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
		}
		if (!isActiveUser(collaborationPayload.getCollaborator().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "user.not-found");
		}
		if (isConflictingCollaboration(collaborationPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.collaboration.conflict");
		}
		return new ChangelogPayload<CollaborationPayload>(collaborationRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), collaborationPayload.getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(collaborationEntity -> {
				CollaborationPayload previousCollaborationPayload = modelMapper.map(collaborationEntity, CollaborationPayload.class);
				collaborationPayload.setActive(true);
				collaborationRepository.save(modelMapper.map(collaborationPayload, CollaborationEntity.class));
				return previousCollaborationPayload;
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.collaboration.not-found")),
			collaborationPayload);
	}

	public CollaborationPayload deleteById(Integer collaborationId) {
		return collaborationRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), collaborationId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(collaborationEntity -> {
				collaborationEntity.setActive(false);
				return modelMapper.map(collaborationRepository.save(collaborationEntity), CollaborationPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.collaboration.not-found"));
	}

}
