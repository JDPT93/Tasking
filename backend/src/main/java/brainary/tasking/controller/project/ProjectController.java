package brainary.tasking.controller.project;

// import org.springdoc.core.annotations.ParameterObject;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import brainary.tasking.payload.project.ProjectPayload;
// import brainary.tasking.service.project.ProjectService;
// import brainary.tasking.token.JwtToken;
// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/project", produces = "application/json")
@Tag(name = "Project")
public class ProjectController {

	// @Autowired
	// private ProjectService projectService;

	// @PostMapping
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<ProjectPayload> create(JwtToken jwtToken, @RequestBody ProjectPayload projectPayload) {
	// if (Integer.parseInt(jwtToken.getSubject()) != projectPayload.getLeader().getId()) {
	// // TODO: Throw exception: You must be the project leader.
	// }
	// return new ResponseEntity<>(projectService.create(projectPayload), HttpStatus.CREATED);
	// }

	// @DeleteMapping
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<List<ProjectPayload>> deleteAll(@RequestBody List<Integer> projectPayloads) {
	// return new ResponseEntity<>(projectService.deleteAll(projectPayloads), HttpStatus.OK);
	// }

	// @DeleteMapping(path = "{projectId}")
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<ProjectPayload> deleteById(@PathVariable Integer projectId) {
	// return new ResponseEntity<>(projectService.deleteById(projectId), HttpStatus.OK);
	// }

	// @GetMapping("me")
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<Page<ProjectPayload>> retrieveRelated(JwtToken jwtToken, @ParameterObject Pageable pageable) {
	// return new ResponseEntity<>(projectService.retrieveByMemberId(Integer.parseInt(jwtToken.getSubject()), pageable), HttpStatus.OK);
	// }

	// @GetMapping(path = "{projectId}")
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<ProjectPayload> retrieveRelatedById(@PathVariable Integer projectId, JwtToken jwtToken) {
	// ProjectPayload projectPayload = projectService.retrieveByIdAndMemberId(projectId, Integer.parseInt(jwtToken.getSubject()));
	// return new ResponseEntity<>(projectPayload, HttpStatus.OK);
	// }

	// @PutMapping
	// @SecurityRequirement(name = "Jwt")
	// public ResponseEntity<ChangelogPayload<ProjectPayload>> update(@RequestBody ProjectPayload projectPayload) {
	// return new ResponseEntity<>(projectService.update(projectPayload), HttpStatus.OK);
	// }

}
