package brainary.tasking.service.project;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.ProjectEntity;
import brainary.tasking.payload.common.ChangelogPayload;
import brainary.tasking.payload.project.ProjectPayload;
import brainary.tasking.repository.project.ProjectRepository;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.user.UserValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project")
public class ProjectService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private UserValidator userValidator;

	public ProjectPayload create(ProjectPayload projectPayload) {
		projectPayload.setId(null);
		projectPayload.setActive(true);
		if (!userValidator.isActive(projectPayload.getLeader().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		if (projectValidator.isConflicting(projectPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.conflict");
		}
		ProjectEntity projectEntity = projectRepository.save(modelMapper.map(projectPayload, ProjectEntity.class));
		return modelMapper.map(projectEntity, ProjectPayload.class);
	}

	public ProjectPayload retrieveById(Integer projectId) {
		return projectRepository.findOne((project, query, builder) -> {
			Predicate equalId = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> modelMapper.map(projectEntity, ProjectPayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found"));
	}

	public Page<ProjectPayload> retrieveByLeaderId(Integer leaderId, Pageable pageable) {
		if (!userValidator.isActive(leaderId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		return projectRepository.findAll((project, query, builder) -> {
			Join<?, ?> leader = project.join("leader");
			Predicate equalLeader = builder.equal(leader.get("id"), leaderId);
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalLeader, isActive);
		}, pageable)
			.map(projectEntity -> modelMapper.map(projectEntity, ProjectPayload.class));
	}

	public ChangelogPayload<ProjectPayload> update(ProjectPayload newProjectPayload) {
		if (!userValidator.isActive(newProjectPayload.getLeader().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found");
		}
		if (projectValidator.isConflicting(newProjectPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.conflict");
		}
		return projectRepository.findOne((project, query, builder) -> {
			Predicate equalId = builder.equal(project.get("id"), newProjectPayload.getId());
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> {
				ProjectPayload oldProjectPayload = modelMapper.map(projectEntity, ProjectPayload.class);
				newProjectPayload.setActive(true);
				projectRepository.save(modelMapper.map(newProjectPayload, ProjectEntity.class));
				return new ChangelogPayload<ProjectPayload>(oldProjectPayload, newProjectPayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found"));
	}

	public ProjectPayload deleteById(Integer projectId) {
		return projectRepository.findOne((project, query, builder) -> {
			Predicate equalId = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(project.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(projectEntity -> {
				projectEntity.setActive(false);
				return modelMapper.map(projectRepository.save(projectEntity), ProjectPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found"));
	}

}
