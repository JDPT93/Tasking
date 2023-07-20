package brainary.tasking.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/user", produces = "application/json")
@Tag(name = "User")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "authentication")
    public ResponseEntity<AuthorizationPayload> authenticate(@RequestBody AuthenticationPayload authenticationSchema) {
        return new ResponseEntity<>(userService.authenticate(authenticationSchema), HttpStatus.OK);
    }

    @PostMapping(path = "authorization")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<AuthorizationPayload> authorize(UsernamePasswordAuthenticationToken token) {
        return new ResponseEntity<>(userService.authorize(token.getPrincipal().toString()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AuthorizationPayload> create(@RequestBody UserSchema userSchema) {
        return new ResponseEntity<>(userService.create(userSchema), HttpStatus.CREATED);
    }

    @DeleteMapping(path = "{userId}")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<UserSchema> deleteById(@PathVariable Integer userId) {
        return new ResponseEntity<>(userService.deleteById(userId), HttpStatus.OK);
    }

    @GetMapping
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<Page<UserSchema>> findAll(@ParameterObject Pageable Pageable) {
        return new ResponseEntity<>(userService.findAll(Pageable), HttpStatus.OK);
    }

    @GetMapping(path = "{userId}")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<UserSchema> findById(@PathVariable Integer userId) {
        return new ResponseEntity<>(userService.findById(userId), HttpStatus.OK);
    }

    @GetMapping(path = "me")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<UserSchema> findMe(UsernamePasswordAuthenticationToken token) {
        return new ResponseEntity<>(userService.findById(Integer.parseInt(token.getPrincipal().toString())), HttpStatus.OK);
    }

    @PutMapping
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<ChangelogPayload<UserSchema>> update(@RequestBody UserSchema userSchema) {
        return new ResponseEntity<>(userService.update(userSchema), HttpStatus.OK);
    }

}
