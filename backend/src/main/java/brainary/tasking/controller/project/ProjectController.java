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

import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.ProjectPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.ProjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Project")
@RestController
@CrossOrigin(origins = "*")
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project")
	public ResponseEntity<ProjectPayload> create(JwtToken jwtToken, @RequestBody ProjectPayload projectPayload) {
		// Integer.parseInt(jwtToken.getSubject())
		projectPayload.getLeader().setId(Integer.parseInt(jwtToken.getSubject()));
		return new ResponseEntity<>(projectService.create(projectPayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/{project-id}")
	public ResponseEntity<Page<ProjectPayload>> retrieveById(JwtToken jwtToken, @PathVariable(name = "project-id") Integer projectId, @ParameterObject Pageable pageable) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(projectService.retrieveById(projectId, pageable), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project")
	public ResponseEntity<Page<ProjectPayload>> retrieveAll(JwtToken jwtToken, @ParameterObject Pageable pageable) {
		return new ResponseEntity<>(projectService.retrieveByLeaderId(Integer.parseInt(jwtToken.getSubject()), pageable), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@PutMapping(path = "api/project")
	public ResponseEntity<ChangelogPayload<ProjectPayload>> update(JwtToken jwtToken, @RequestBody ProjectPayload projectPayload) {
		Integer.parseInt(jwtToken.getSubject());
		return new ResponseEntity<>(projectService.update(projectPayload), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/{project-id}")
	public ResponseEntity<ProjectPayload> deleteById(JwtToken jwtToken, @PathVariable(name = "project-id") Integer projectId) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(projectService.deleteById(projectId), HttpStatus.OK);
	}

}
