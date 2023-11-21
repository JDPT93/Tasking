package brainary.tasking.validator.project.stage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.repository.project.stage.TypeRepository;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.stage.type")
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

}
