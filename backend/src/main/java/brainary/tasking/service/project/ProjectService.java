package brainary.tasking.service.project;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.ProjectEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.ProjectPayload;
import brainary.tasking.repository.project.ProjectRepository;
import brainary.tasking.repository.user.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service:project")
public class ProjectService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private UserRepository userRepository;

	private Boolean isValidUser(Integer userId) {
		return userRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), userId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isConflictingProject(ProjectPayload projectPayload) {
		return projectRepository.exists((root, query, builder) -> {
			Join<?, ?> leader = root.join("leader");
			Predicate equalLeader = builder.equal(leader.get("id"), projectPayload.getLeader().getId());
			Predicate equalName = builder.equal(root.get("name"), projectPayload.getName());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (projectPayload.getId() == null) {
				return builder.and(equalLeader, equalName, isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), projectPayload.getId());
			return builder.and(notEqualId, equalLeader, equalName, isActive);
		});
	}

	public ProjectPayload create(ProjectPayload projectPayload) {
		projectPayload.setId(null);
		projectPayload.setActive(true);
		if (!isValidUser(projectPayload.getLeader().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		if (isConflictingProject(projectPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.conflict");
		}
		return modelMapper.map(projectRepository.save(modelMapper.map(projectPayload, ProjectEntity.class)), ProjectPayload.class);
	}

	public ProjectPayload retrieveById(Integer projectId) {
		return projectRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> modelMapper.map(projectEntity, ProjectPayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found"));
	}

	public Page<ProjectPayload> retrieveByLeaderId(Integer leaderId, Pageable pageable) {
		if (!isValidUser(leaderId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		return projectRepository.findAll((root, query, builder) -> {
			Join<?, ?> leader = root.join("leader");
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalLeader, isActive);
		}, pageable)
			.map(projectEntity -> modelMapper.map(projectEntity, ProjectPayload.class));
	}

	public ChangelogPayload<ProjectPayload> update(ProjectPayload projectPayload) {
		if (!isValidUser(projectPayload.getLeader().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		if (isConflictingProject(projectPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.conflict");
		}
		return new ChangelogPayload<ProjectPayload>(projectRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), projectPayload.getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> {
				ProjectPayload previousProjectPayload = modelMapper.map(projectEntity, ProjectPayload.class);
				projectPayload.setActive(true);
				projectRepository.save(modelMapper.map(projectPayload, ProjectEntity.class));
				return previousProjectPayload;
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found")),
			projectPayload);
	}

	public ProjectPayload deleteById(Integer projectId) {
		return projectRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> {
				projectEntity.setActive(false);
				return modelMapper.map(projectRepository.save(projectEntity), ProjectPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found"));
	}

}
