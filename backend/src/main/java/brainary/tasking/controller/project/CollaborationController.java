package brainary.tasking.controller.project;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import brainary.tasking.payload.project.CollaborationPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.CollaborationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Collaboration")
@RestController
@CrossOrigin(origins = "*")
public class CollaborationController {

	@Autowired
	private CollaborationService collaborationService;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/collaboration")
	public ResponseEntity<CollaborationPayload> create(JwtToken jwtToken, @RequestBody CollaborationPayload collaborationPayload) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(collaborationService.create(collaborationPayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/collaboration")
	public ResponseEntity<Page<CollaborationPayload>> retrieveAll(JwtToken jwtToken, @ParameterObject Pageable pageable) {
		return new ResponseEntity<>(collaborationService.retrieveByCollaboratorId(Integer.parseInt(jwtToken.getSubject()), pageable), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/collaboration/{collaboration-id}")
	public ResponseEntity<CollaborationPayload> deleteById(JwtToken jwtToken, @PathVariable(name = "collaboration-id") Integer collaborationId) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(collaborationService.deleteById(collaborationId), HttpStatus.OK);
	}

}
