package brainary.tasking.controller.project.goal;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import brainary.tasking.payload.project.goal.PriorityPayload;
import brainary.tasking.security.JwtToken;
import brainary.tasking.service.project.goal.PriorityService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "project.goal.priority")
@RestController
@CrossOrigin(origins = "*")
public class PriorityController {

	@Autowired
	private PriorityService priorityService;

	@SecurityRequirement(name = "Jwt")
	@GetMapping(path = "api/project/priority")
	public ResponseEntity<Page<PriorityPayload>> retrieveAll(JwtToken jwtToken, @ParameterObject Pageable pageable) {
		return new ResponseEntity<>(priorityService.retrieveAll(pageable), HttpStatus.OK);
	}

}
