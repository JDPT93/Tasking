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
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.payload.project.CollaborationPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.CollaborationService;
import brainary.tasking.validator.project.CollaborationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "project.collaboration")
@RestController
@CrossOrigin(origins = "*")
public class CollaborationController {

	@Autowired
	private CollaborationService collaborationService;

	@Autowired
	private CollaborationValidator collaborationValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/collaboration")
	public ResponseEntity<CollaborationPayload> create(JwtToken jwtToken, @RequestBody CollaborationPayload collaborationPayload) {
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), collaborationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.collaboration.create.forbidden");
		}
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
		if (!collaborationValidator.doesCollaboratorMatchById(collaborationId, Integer.parseInt(jwtToken.getSubject()))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.collaboration.delete.forbidden");
		}
		return new ResponseEntity<>(collaborationService.deleteById(collaborationId), HttpStatus.OK);
	}

}
