package brainary.tasking.service.project.goal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.repository.project.ProjectRepository;
import brainary.tasking.repository.project.goal.TypeRepository;
import brainary.tasking.entity.project.goal.TypeEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.payload.project.goal.TypePayload;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "project.goal.type")
public class TypeService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private TypeRepository typeRepository;

	@Autowired
	private ProjectRepository projectRepository;

	private Boolean isValidProject(Integer projectId) {
		return projectRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isConflictingType(TypePayload typePayload) {
		return typeRepository.exists((root, query, builder) -> {
			Join<?, ?> project = root.join("project");
			Predicate equalProject = builder.equal(project.get("id"), typePayload.getProject().getId());
			Predicate equalName = builder.equal(root.get("name"), typePayload.getName());
			Predicate equalIcon = builder.equal(root.get("icon"), typePayload.getIcon());
			Predicate equalColor = builder.equal(root.get("color"), typePayload.getColor());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (typePayload.getId() == null) {
				return builder.and(equalProject, builder.or(equalName, builder.and(equalIcon, equalColor)), isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), typePayload.getId());
			return builder.and(notEqualId, equalProject, builder.or(equalName, builder.and(equalIcon, equalColor)), isActive);
		});
	}

	public TypePayload create(TypePayload typePayload) {
		typePayload.setId(null);
		typePayload.setActive(true);
		if (!isValidProject(typePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (isConflictingType(typePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.type.conflict");
		}
		return modelMapper.map(typeRepository.save(modelMapper.map(typePayload, TypeEntity.class)), TypePayload.class);
	}

	public Page<IssuePayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!isValidProject(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return typeRepository.findAll((root, query, builder) -> {
			Join<?, ?> project = root.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public ChangelogPayload<TypePayload> update(TypePayload typePayload) {
		if (!isValidProject(typePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (isConflictingType(typePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.type.conflict");
		}
		return new ChangelogPayload<TypePayload>(typeRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), typePayload.getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(typeEntity -> {
				TypePayload previousTypePayload = modelMapper.map(typeEntity, TypePayload.class);
				typePayload.setActive(true);
				typeRepository.save(modelMapper.map(typePayload, TypeEntity.class));
				return previousTypePayload;
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found")),
			typePayload);
	}

	public IssuePayload deleteById(Integer typeId) {
		return typeRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), typeId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(typeEntity -> {
				typeEntity.setActive(false);
				return modelMapper.map(typeRepository.save(typeEntity), IssuePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found"));
	}

}
