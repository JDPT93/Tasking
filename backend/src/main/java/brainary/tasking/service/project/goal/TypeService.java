package brainary.tasking.service.project.goal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.repository.project.goal.TypeRepository;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.TypeValidator;
import brainary.tasking.entity.project.goal.TypeEntity;
import brainary.tasking.payload.common.ChangelogPayload;
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
	private TypeValidator typeValidator;

	@Autowired
	private ProjectValidator projectValidator;

	public TypePayload create(TypePayload typePayload) {
		typePayload.setId(null);
		typePayload.setActive(true);
		if (!projectValidator.isActive(typePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (typeValidator.isConflicting(typePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.type.conflict");
		}
		return modelMapper.map(typeRepository.save(modelMapper.map(typePayload, TypeEntity.class)), TypePayload.class);
	}

	public Page<IssuePayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!projectValidator.isActive(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return typeRepository.findAll((type, query, builder) -> {
			Join<?, ?> project = type.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(type.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public ChangelogPayload<TypePayload> update(TypePayload newTypePayload) {
		if (!projectValidator.isActive(newTypePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (typeValidator.isConflicting(newTypePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.type.conflict");
		}
		return typeRepository.findOne((type, query, builder) -> {
			Predicate equalId = builder.equal(type.get("id"), newTypePayload.getId());
			Predicate isActive = builder.isTrue(type.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(typeEntity -> {
				TypePayload oldTypePayload = modelMapper.map(typeEntity, TypePayload.class);
				newTypePayload.setActive(true);
				typeRepository.save(modelMapper.map(newTypePayload, TypeEntity.class));
				return new ChangelogPayload<TypePayload>(oldTypePayload, newTypePayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found"));
	}

	public IssuePayload deleteById(Integer typeId) {
		return typeRepository.findOne((type, query, builder) -> {
			Predicate equalId = builder.equal(type.get("id"), typeId);
			Predicate isActive = builder.isTrue(type.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(typeEntity -> {
				typeEntity.setActive(false);
				return modelMapper.map(typeRepository.save(typeEntity), IssuePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found"));
	}

}
