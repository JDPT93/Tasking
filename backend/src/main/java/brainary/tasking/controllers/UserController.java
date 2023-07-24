package brainary.tasking.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import brainary.tasking.payloads.AuthenticationPayload;
import brainary.tasking.payloads.AuthorizationPayload;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.schemas.UserSchema;
import brainary.tasking.services.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/user", produces = "application/json")
@Tag(name = "User")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "authentication")
    public ResponseEntity<AuthorizationPayload> authenticate(@RequestBody @Valid AuthenticationPayload authenticationSchema) {
        return new ResponseEntity<>(userService.authenticate(authenticationSchema), HttpStatus.OK);
    }

    @PostMapping(path = "authorization")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<AuthorizationPayload> authorize(UsernamePasswordAuthenticationToken token) {
        return new ResponseEntity<>(userService.authorize((Integer) token.getPrincipal()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AuthorizationPayload> create(@RequestBody @Valid UserSchema userSchema) {
        return new ResponseEntity<>(userService.create(userSchema), HttpStatus.CREATED);
    }

    @GetMapping
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<UserSchema> retrieveCurrent(UsernamePasswordAuthenticationToken token) {
        return new ResponseEntity<>(userService.retrieveById((Integer) token.getPrincipal()), HttpStatus.OK);
    }

    @PutMapping
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<ChangelogPayload<UserSchema>> updateCurrent(UsernamePasswordAuthenticationToken token, @RequestBody @Valid UserSchema userSchema) {
        if (!token.getPrincipal().equals(userSchema.getId())) {
            // TODO: Throw exception: You are not this user.
        }
        return new ResponseEntity<>(userService.update(userSchema), HttpStatus.OK);
    }

}
