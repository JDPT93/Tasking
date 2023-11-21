package brainary.tasking.service.user;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.user.UserEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.user.AuthenticationPayload;
import brainary.tasking.payload.user.AuthorizationPayload;
import brainary.tasking.payload.user.UserPayload;
import brainary.tasking.repository.user.UserRepository;
import brainary.tasking.security.JwtFilter;
import brainary.tasking.security.JwtToken;
import brainary.tasking.validator.user.UserValidator;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.user")
public class UserService {

	@Autowired
	private JwtFilter jwtFilter;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserValidator userValidator;

	public UserPayload authenticate(AuthenticationPayload authenticationPayload) {
		return userRepository.findOne((user, query, builder) -> {
			Predicate equalEmail = builder.equal(user.get("email"), authenticationPayload.getEmail());
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalEmail, isActive);
		})
			.map(userEntity -> passwordEncoder.matches(authenticationPayload.getPassword(), userEntity.getPassword()) ? modelMapper.map(userEntity, UserPayload.class) : null)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user.unauthorized"));
	}

	public AuthorizationPayload authorize(UserPayload userPayload) {
		return new AuthorizationPayload(modelMapper.map(userPayload, UserPayload.class), jwtFilter.authorize(userPayload.getId().toString()));
	}

	public AuthorizationPayload reauthorize(JwtToken jwtToken) {
		return authorize(userRepository.findOne((user, query, builder) -> {
			Predicate equalId = builder.equal(user.get("id"), jwtToken.getSubject());
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(userEntity -> modelMapper.map(userEntity, UserPayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user.unauthorized")));
	}

	public AuthorizationPayload create(UserPayload userPayload) {
		userPayload.setActive(true);
		if (userValidator.isConflicting(userPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "user.conflict");
		}
		userPayload.setPassword(passwordEncoder.encode(userPayload.getPassword()));
		return authorize(modelMapper.map(userRepository.save(modelMapper.map(userPayload, UserEntity.class)), UserPayload.class));
	}

	public UserPayload retrieveByEmail(String userEmail) {
		return userRepository.findOne((user, query, builder) -> {
			Predicate equalEmail = builder.equal(user.get("email"), userEmail);
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalEmail, isActive);
		})
			.map(userEntity -> modelMapper.map(userEntity, UserPayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found"));
	}

	public UserPayload retrieveById(Integer userId) {
		return userRepository.findOne((user, query, builder) -> {
			Predicate equalId = builder.equal(user.get("id"), userId);
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(userEntity -> modelMapper.map(userEntity, UserPayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found"));
	}

	public ChangelogPayload<UserPayload> update(UserPayload newUserPayload) {
		if (userValidator.isConflicting(newUserPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "user.conflict");
		}
		return userRepository.findOne((user, query, builder) -> {
			Predicate equalId = builder.equal(user.get("id"), newUserPayload.getId());
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(userEntity -> {
				UserPayload oldUserPayload = modelMapper.map(userEntity, UserPayload.class);
				newUserPayload.setPassword(newUserPayload.getPassword() == null ? userEntity.getPassword() : passwordEncoder.encode(newUserPayload.getPassword()));
				newUserPayload.setActive(true);
				userRepository.save(modelMapper.map(newUserPayload, UserEntity.class));
				return new ChangelogPayload<UserPayload>(oldUserPayload, newUserPayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found"));
	}

	public UserPayload deleteById(String userId) {
		return userRepository.findOne((user, query, builder) -> {
			Predicate equalId = builder.equal(user.get("id"), userId);
			Predicate isActive = builder.isTrue(user.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(userEntity -> {
				userEntity.setActive(false);
				return modelMapper.map(userRepository.save(userEntity), UserPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user.not-found"));
	}

}
