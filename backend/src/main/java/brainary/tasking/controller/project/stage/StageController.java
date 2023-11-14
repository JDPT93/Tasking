package brainary.tasking.controller.project.stage;

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
import brainary.tasking.payload.project.stage.StagePayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.stage.StageService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Stage")
@RestController
@CrossOrigin(origins = "*")
public class StageController {

	@Autowired
	private StageService stageService;

	@SecurityRequirement(name = "Jwt")
	@PostMapping(path = "api/project/stage")
	public ResponseEntity<StagePayload> create(JwtToken jwtToken, @RequestBody StagePayload stagePayload) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(stageService.create(stagePayload), HttpStatus.CREATED);
	}

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/{project-id}/stage")
	public ResponseEntity<Page<StagePayload>> retrieveById(JwtToken jwtToken, @PathVariable(name = "project-id") Integer projectId, @ParameterObject Pageable pageable) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(stageService.retrieveByProjectId(projectId, pageable), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@PutMapping(path = "api/project/stage")
	public ResponseEntity<ChangelogPayload<StagePayload>> update(JwtToken jwtToken, @RequestBody StagePayload stagePayload) {
		Integer.parseInt(jwtToken.getSubject());
		return new ResponseEntity<>(stageService.update(stagePayload), HttpStatus.OK);
	}

	@SecurityRequirement(name = "Jwt")
	@DeleteMapping(path = "api/project/stage/{stage-id}")
	public ResponseEntity<StagePayload> deleteById(JwtToken jwtToken, @PathVariable(name = "stage-id") Integer stageId) {
		// Integer.parseInt(jwtToken.getSubject())
		return new ResponseEntity<>(stageService.deleteById(stageId), HttpStatus.OK);
	}

}
