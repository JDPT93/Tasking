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

import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.goal.IssueService;
import brainary.tasking.validator.project.CollaborationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.IssueValidator;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "project.goal.issue")
@RestController
@CrossOrigin(origins = "*")
public class IssueController {

	@Autowired
	private IssueService issueService;

	@Autowired
	private IssueValidator issueValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private CollaborationValidator collaborationValidator;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/goal/issue")
	public ResponseEntity<IssuePayload> create(JwtToken jwtToken, @RequestBody IssuePayload issuePayload) {
		if (!projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), issuePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.issue.create.forbidden");
		}
		return new ResponseEntity<>(issueService.create(issuePayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/goal/issue/by/stage/{stage-id}")
	public ResponseEntity<Page<IssuePayload>> retrieveById(JwtToken jwtToken, @PathVariable(name = "stage-id") Integer stageId, @ParameterObject Pageable pageable) {
		if (!(projectValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), stageId) || collaborationValidator.doesCollaboratorMatchByProjectId(Integer.parseInt(jwtToken.getSubject()), stageId))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.issue.retrieve-by-id.forbidden");
		}
		return new ResponseEntity<>(issueService.retrieveByStageId(stageId, pageable), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@PutMapping(path = "api/project/goal/issue")
	public ResponseEntity<List<ChangelogPayload<IssuePayload>>> update(JwtToken jwtToken, @RequestBody IssuePayload issuePayload) {
		// if (!issueValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), issuePayload.getId())) {
		// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.issue.update.forbidden");
		// }
		return new ResponseEntity<>(issueService.update(issuePayload), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/goal/issue/{issue-id}")
	public ResponseEntity<IssuePayload> deleteById(JwtToken jwtToken, @PathVariable(name = "issue-id") Integer issueId) {
		// if (!issueValidator.doesLeaderMatchById(Integer.parseInt(jwtToken.getSubject()), issueId)) {
		// throw new ResponseStatusException(HttpStatus.FORBIDDEN, "project.goal.issue.delete-by-id.forbidden");
		// }
		return new ResponseEntity<>(issueService.deleteById(issueId), HttpStatus.OK);
	}

}
