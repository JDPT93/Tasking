package brainary.tasking.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.repositories.ProjectRepository;
import brainary.tasking.schemas.ProjectSchema;

@Service
public class ProjectService {

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ProjectRepository projectRepository;

    // public ProjectSchema create(ProjectSchema projectSchema) {
    // if (!Objects.isNull(projectSchema.getId()) && projectRepository.existsById(projectSchema.getId())) {
    // throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("project.conflict", null, LocaleContextHolder.getLocale()));
    // }
    // projectSchema.setActive(true);
    // return modelMapper.map(projectRepository.save(modelMapper.map(projectSchema, ProjectEntity.class)), ProjectSchema.class);
    // }

    // public List<ProjectSchema> deleteAll(List<Integer> projectIdList) {
    // return projectIdList.stream().map(projectId -> deleteById(projectId)).toList();
    // }

    // public ProjectSchema deleteById(Integer projectId) {
    // ProjectSchema projectSchema = retrieveById(projectId);
    // projectRepository.deleteById(projectId);
    // return projectSchema;
    // }

    public Page<ProjectSchema> retrieveByMemberId(Integer memberId, Pageable pageable) {
        return projectRepository.findByMemberId(memberId, pageable).map(projectEntity -> modelMapper.map(projectEntity, ProjectSchema.class));
    }

    public ProjectSchema retrieveByIdAndMemberId(Integer projectId, Integer memberId) {
        return modelMapper.map(projectRepository.findByIdAndMemberId(projectId, memberId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("project.not-found", null, LocaleContextHolder.getLocale()))), ProjectSchema.class);
    }

    // public ChangelogPayload<ProjectSchema> update(ProjectSchema newProjectSchema) {
    // ProjectSchema oldProjectSchema = retrieveById(newProjectSchema.getId());
    // newProjectSchema.setActive(oldProjectSchema.getActive());
    // projectRepository.save(modelMapper.map(newProjectSchema, ProjectEntity.class));
    // return ChangelogPayload.<ProjectSchema>builder()
    // .before(oldProjectSchema)
    // .after(newProjectSchema)
    // .build();
    // }

}
