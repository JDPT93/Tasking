package brainary.tasking.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import brainary.tasking.payload.user.AuthenticationPayload;
import brainary.tasking.payload.user.AuthorizationPayload;
import brainary.tasking.payload.user.UserPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.user.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User")
@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "api/user/sign-in")
    public ResponseEntity<AuthorizationPayload> authenticate(@RequestBody AuthenticationPayload authenticationPayload) {
        return new ResponseEntity<>(userService.authorize(userService.authenticate(authenticationPayload)), HttpStatus.OK);
    }

    @PostMapping(path = "api/user/token")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<AuthorizationPayload> authorize(JwtToken jwtToken) {
        return new ResponseEntity<>(userService.reauthorize(jwtToken), HttpStatus.OK);
    }

    @PostMapping(path = "api/user")
    public ResponseEntity<AuthorizationPayload> create(@RequestBody UserPayload userPayload) {
        return new ResponseEntity<>(userService.create(userPayload), HttpStatus.CREATED);
    }

    @GetMapping(path = "api/user/self")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<UserPayload> retrieveSelf(JwtToken jwtToken) {
        return new ResponseEntity<>(userService.retrieveById(Integer.parseInt(jwtToken.getSubject())), HttpStatus.OK);
    }

}
