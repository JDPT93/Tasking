package brainary.tasking.services;

import java.util.Objects;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.UserEntity;
import brainary.tasking.filters.JwtFilter;
import brainary.tasking.payloads.AuthenticationPayload;
import brainary.tasking.payloads.AuthorizationPayload;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.UserRepository;
import brainary.tasking.schemas.UserSchema;

@Service
public class UserService {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public AuthorizationPayload authenticate(AuthenticationPayload authenticationSchema) {
        UserSchema userSchema = findByEmail(authenticationSchema.getEmail());
        if (!(userSchema.getActive() && passwordEncoder.matches(authenticationSchema.getPassword(), userSchema.getPassword()))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, messageSource.getMessage("user.unauthorized", null, LocaleContextHolder.getLocale()));
        }
        return authorize(userSchema);
    }

    private AuthorizationPayload authorize(UserSchema userSchema) {
        return AuthorizationPayload.builder()
            .user(userSchema)
            .token(jwtFilter.authorize(userSchema.getId().toString()))
            .build();
    }

    public AuthorizationPayload authorize(Integer userId) {
        return AuthorizationPayload.builder()
            .token(jwtFilter.authorize(userId.toString()))
            .build();
    }

    public AuthorizationPayload create(UserSchema userSchema) {
        if (!Objects.isNull(userSchema.getId()) && userRepository.existsById(userSchema.getId()) || userRepository.existsByEmail(userSchema.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("user.conflict", null, LocaleContextHolder.getLocale()));
        }
        userSchema.setActive(true);
        return authorize(modelMapper.map(userRepository.save(modelMapper.map(userSchema, UserEntity.class)), UserSchema.class));
    }

    public UserSchema findByEmail(String userEmail) {
        return modelMapper.map(userRepository.findByEmail(userEmail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("user.not-found", null, LocaleContextHolder.getLocale()))), UserSchema.class);
    }

    public UserSchema findById(Integer userId) {
        return modelMapper.map(userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("user.not-found", null, LocaleContextHolder.getLocale()))), UserSchema.class);
    }

    public ChangelogPayload<UserSchema> update(UserSchema userSchema) {
        return ChangelogPayload.<UserSchema>builder()
            .before(findById(userSchema.getId()))
            .after(modelMapper.map(userRepository.save(modelMapper.map(userSchema, UserEntity.class)), UserSchema.class))
            .build();
    }

}
