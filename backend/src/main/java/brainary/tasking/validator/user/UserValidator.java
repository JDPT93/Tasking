package brainary.tasking.validator.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import brainary.tasking.payload.user.UserPayload;
import brainary.tasking.repository.user.UserRepository;
import jakarta.persistence.criteria.Predicate;

@Component(value = "validator.user")
public class UserValidator {

	@Autowired
	private UserRepository userRepository;

	public Boolean isActive(Integer userId) {
		return userRepository.exists((user, query, builder) -> {
			Predicate equalId = builder.equal(user.get("id"), userId);
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	public Boolean isConflicting(UserPayload userPayload) {
		return userRepository.exists((user, query, builder) -> {
			Predicate equalEmail = builder.equal(user.get("email"), userPayload.getEmail());
			Predicate isActive = builder.isTrue(user.get("active"));
			if (userPayload.getId() == null) {
				return builder.and(equalEmail, isActive);
			}
			Predicate notEqualId = builder.notEqual(user.get("id"), userPayload.getId());
			return builder.and(notEqualId, equalEmail, isActive);
		});
	}

}
