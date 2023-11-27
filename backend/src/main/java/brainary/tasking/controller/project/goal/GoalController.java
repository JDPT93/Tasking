package brainary.tasking.controller.project.goal;

import java.util.List;

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
import brainary.tasking.payload.project.goal.GoalPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.goal.GoalService;
import brainary.tasking.validator.project.CollaborationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.GoalValidator;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "project.goal")
@RestController
@CrossOrigin(origins = "*")
public class GoalController {

	@Autowired
	private GoalService goalService;

	@Autowired
	private GoalValidator goalValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private CollaborationValidator collaborationValidator;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/goal")
	public ResponseEntity<GoalPayload> create(JwtToken jwtToken, @RequestBody GoalPayload goalPayload) {
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), goalPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.create.forbidden");
		}
		return new ResponseEntity<>(goalService.create(goalPayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/{project-id}/goal")
	public ResponseEntity<Page<GoalPayload>> retrieveById(JwtToken jwtToken, @PathVariable(name = "project-id") Integer projectId, @ParameterObject Pageable pageable) {
		if (!(projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), projectId) || collaborationValidator.doesCollaboratorMatchByProjectId(Integer.parseInt(jwtToken.getSubject()), projectId))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.retrieve-by-project-id.forbidden");
		}
		return new ResponseEntity<>(goalService.retrieveByProjectId(projectId, pageable), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@PutMapping(path = "api/project/goal")
	public ResponseEntity<List<ChangelogPayload<GoalPayload>>> update(JwtToken jwtToken, @RequestBody GoalPayload goalPayload) {
		if (!goalValidator.doesProjectLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), goalPayload.getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.update.forbidden");
		}
		return new ResponseEntity<>(goalService.update(goalPayload), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/goal/{goal-id}")
	public ResponseEntity<GoalPayload> deleteById(JwtToken jwtToken, @PathVariable(name = "goal-id") Integer goalId) {
		if (!goalValidator.doesProjectLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), goalId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.delete-by-id.forbidden");
		}
		return new ResponseEntity<>(goalService.deleteById(goalId), HttpStatus.OK);
	}

}
