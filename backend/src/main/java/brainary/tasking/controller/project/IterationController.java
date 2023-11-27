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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.payload.common.ChangelogPayload;
import brainary.tasking.payload.project.IterationPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.IterationService;
import brainary.tasking.validator.project.IterationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "project.iteration")
@RestController
@CrossOrigin(origins = "*")
public class IterationController {

	@Autowired
	private IterationService iterationService;

	@Autowired
	private IterationValidator iterationValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/iteration")
	public ResponseEntity<IterationPayload> create(JwtToken jwtToken, @RequestBody IterationPayload iterationPayload) {
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), iterationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.iteration.create.forbidden");
		}
		return new ResponseEntity<>(iterationService.create(iterationPayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/{project-id}/iteration")
	public ResponseEntity<Page<IterationPayload>> retrieveAll(JwtToken jwtToken, @PathVariable(name = "project-id") Integer projectId, @ParameterObject Pageable pageable) {
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), projectId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.iteration.retrieve-by-project-id.forbidden");
		}
		return new ResponseEntity<>(iterationService.retrieveByProjectId(projectId, pageable), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@PutMapping(path = "api/project/iteration")
	public ResponseEntity<ChangelogPayload<IterationPayload>> update(JwtToken jwtToken, @RequestBody IterationPayload iterationPayload) {
		if (!iterationValidator.doesProjectLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), iterationPayload.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.iteration.update.forbidden");
		}
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), iterationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.iteration.update.forbidden");
		}
		return new ResponseEntity<>(iterationService.update(iterationPayload), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/iteration/{iteration-id}")
	public ResponseEntity<IterationPayload> deleteById(JwtToken jwtToken, @PathVariable(name = "iteration-id") Integer iterationId) {
		if (!iterationValidator.doesProjectLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), iterationId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.iteration.delete.forbidden");
		}
		return new ResponseEntity<>(iterationService.deleteById(iterationId), HttpStatus.OK);
	}

}
