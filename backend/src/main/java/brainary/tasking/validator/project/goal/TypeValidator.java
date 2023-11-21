package brainary.tasking.validator.project.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.goal.TypePayload;
import brainary.tasking.repository.project.goal.TypeRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.goal.type")
public class TypeValidator {

	@Autowired
	private TypeRepository typeRepository;

	public Boolean isActive(Integer typeId) {
		return typeRepository.exists((type, query, builder) -> {
			Predicate equalId = builder.equal(type.get("id"), typeId);
			Predicate isActive = builder.isTrue(type.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(TypePayload typePayload) {
		return typeRepository.exists((type, query, builder) -> {
			Join<?, ?> project = type.join("project");
			Predicate equalProject = builder.equal(project.get("id"), typePayload.getProject().getId());
			Predicate equalName = builder.equal(type.get("name"), typePayload.getName());
			Predicate equalIcon = builder.equal(type.get("icon"), typePayload.getIcon());
			Predicate equalColor = builder.equal(type.get("color"), typePayload.getColor());
			Predicate isActive = builder.isTrue(type.get("active"));
			if (typePayload.getId() == null) {
				return builder.and(equalProject, builder.or(equalName, builder.and(equalIcon, equalColor)), isActive);
			}
			Predicate notEqualId = builder.notEqual(type.get("id"), typePayload.getId());
			return builder.and(notEqualId, equalProject, builder.or(equalName, builder.and(equalIcon, equalColor)), isActive);
		});
	}

}
