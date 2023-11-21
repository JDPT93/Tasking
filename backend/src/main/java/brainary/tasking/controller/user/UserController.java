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

@Tag(name = "user")
@RestController
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping(path = "api/user/sign-up")
	public ResponseEntity<AuthorizationPayload> signUp(@RequestBody UserPayload userPayload) {
		return new ResponseEntity<>(userService.create(userPayload), HttpStatus.CREATED);
	}

	@PostMapping(path = "api/user/sign-in")
	public ResponseEntity<AuthorizationPayload> signIn(@RequestBody AuthenticationPayload authenticationPayload) {
		return new ResponseEntity<>(userService.authorize(userService.authenticate(authenticationPayload)), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/user/who-am-i")
	public ResponseEntity<UserPayload> whoAmI(JwtToken jwtToken) {
		return new ResponseEntity<>(userService.retrieveById(Integer.parseInt(jwtToken.getSubject())), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/user/token")
	public ResponseEntity<AuthorizationPayload> renewToken(JwtToken jwtToken) {
		return new ResponseEntity<>(userService.reauthorize(jwtToken), HttpStatus.OK);
	}

}
