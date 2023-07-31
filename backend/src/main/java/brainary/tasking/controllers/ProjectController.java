package brainary.tasking.controllers;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import brainary.tasking.schemas.ProjectSchema;
import brainary.tasking.services.ProjectService;
import brainary.tasking.tokens.JwtToken;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/project", produces = "application/json")
@Tag(name = "Project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // @PostMapping
    // @SecurityRequirement(name = "Jwt")
    // public ResponseEntity<ProjectSchema> create(JwtToken jwtToken, @RequestBody @Valid ProjectSchema projectSchema) {
    // if (Integer.parseInt(jwtToken.getSubject()) != projectSchema.getLeader().getId()) {
    // // TODO: Throw exception: You must be the project leader.
    // }
    // return new ResponseEntity<>(projectService.create(projectSchema), HttpStatus.CREATED);
    // }

    // @DeleteMapping
    // @SecurityRequirement(name = "Jwt")
    // public ResponseEntity<List<ProjectSchema>> deleteAll(@RequestBody List<Integer> projectSchemas) {
    // return new ResponseEntity<>(projectService.deleteAll(projectSchemas), HttpStatus.OK);
    // }

    // @DeleteMapping(path = "{projectId}")
    // @SecurityRequirement(name = "Jwt")
    // public ResponseEntity<ProjectSchema> deleteById(@PathVariable Integer projectId) {
    // return new ResponseEntity<>(projectService.deleteById(projectId), HttpStatus.OK);
    // }

    @GetMapping("me")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<Page<ProjectSchema>> retrieveRelated(JwtToken jwtToken, @ParameterObject Pageable pageable) {
        return new ResponseEntity<>(projectService.retrieveByMemberId(Integer.parseInt(jwtToken.getSubject()), pageable), HttpStatus.OK);
    }

    @GetMapping(path = "{projectId}")
    @SecurityRequirement(name = "Jwt")
    public ResponseEntity<ProjectSchema> retrieveRelatedById(@PathVariable Integer projectId, JwtToken jwtToken) {
        ProjectSchema projectSchema = projectService.retrieveByIdAndMemberId(projectId, Integer.parseInt(jwtToken.getSubject()));
        return new ResponseEntity<>(projectSchema, HttpStatus.OK);
    }

    // @PutMapping
    // @SecurityRequirement(name = "Jwt")
    // public ResponseEntity<ChangelogPayload<ProjectSchema>> update(@RequestBody @Valid ProjectSchema projectSchema) {
    // return new ResponseEntity<>(projectService.update(projectSchema), HttpStatus.OK);
    // }

}
