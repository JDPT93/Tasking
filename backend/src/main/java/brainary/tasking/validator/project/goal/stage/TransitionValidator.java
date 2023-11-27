package brainary.tasking.validator.project.goal.stage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.project.goal.stage.TransitionPayload;
import brainary.tasking.repository.project.goal.stage.TransitionRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.stage.transition")
public class TransitionValidator {

	@Autowired
	private TransitionRepository transitionRepository;

	public Boolean isActive(Integer transitionId) {
		return transitionRepository.exists((transition, query, builder) -> {
			Predicate equalId = builder.equal(transition.get("id"), transitionId);
			Predicate isActive = builder.isTrue(transition.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(TransitionPayload transitionPayload) {
		return transitionRepository.exists((transition, query, builder) -> {
			Join<?, ?> source = transition.join("source");
			Join<?, ?> target = transition.join("target");
			Predicate equalSource = builder.equal(source.get("id"), transitionPayload.getSource().getId());
			Predicate equalTarget = builder.equal(target.get("id"), transitionPayload.getTarget().getId());
			Predicate isActive = builder.isTrue(transition.get("active"));
			if (transitionPayload.getId() == null) {
				return builder.and(builder.and(equalSource, equalTarget), isActive);
			}
			Predicate notEqualId = builder.notEqual(transition.get("id"), transitionPayload.getId());
			return builder.and(notEqualId, builder.and(equalSource, equalTarget), isActive);
		});
	}

}
