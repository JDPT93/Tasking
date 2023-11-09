package brainary.tasking.service.project.stage;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.stage.TypeEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.stage.TypePayload;
import brainary.tasking.repository.project.stage.TypeRepository;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.stage.type")
public class TypeService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private TypeRepository typeRepository;

	private Boolean isConflictingType(TypePayload typePayload) {
		return typeRepository.exists((root, query, builder) -> {
			Predicate equalName = builder.equal(root.get("name"), typePayload.getName());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (typePayload.getId() == null) {
				return builder.and(equalName, isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), typePayload.getId());
			return builder.and(notEqualId, equalName, isActive);
		});
	}

	public TypePayload create(TypePayload typePayload) {
		typePayload.setId(null);
		typePayload.setActive(true);
		if (isConflictingType(typePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.conflict");
		}
		return modelMapper.map(typeRepository.save(modelMapper.map(typePayload, TypeEntity.class)), TypePayload.class);
	}

	public Page<TypePayload> retrieveAll(Pageable pageable) {
		return typeRepository.findAll((root, query, builder) -> {
			Predicate isActive = builder.isTrue(root.get("active"));
			return isActive;
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, TypePayload.class));
	}

	public ChangelogPayload<TypePayload> update(TypePayload typePayload) {
		if (isConflictingType(typePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.conflict");
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
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.type.not-found")),
			typePayload);
	}

	public TypePayload deleteById(Integer typeId) {
		return typeRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), typeId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(typeEntity -> {
				typeEntity.setActive(false);
				return modelMapper.map(typeRepository.save(typeEntity), TypePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.type.not-found"));
	}

}
