package brainary.tasking.services;

import java.util.Objects;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.ProjectEntity;
import brainary.tasking.payloads.ChangelogPayload;
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

    public ProjectSchema create(ProjectSchema projectSchema) {
        if (projectRepository.existsById(projectSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("project.conflict", null, LocaleContextHolder.getLocale()));
        }
        return modelMapper.map(projectRepository.save(modelMapper.map(projectSchema, ProjectEntity.class)), ProjectSchema.class);
    }

    public ProjectSchema deleteById(Integer projectId) {
        ProjectSchema projectSchema = findById(projectId);
        projectRepository.deleteById(projectId);
        return projectSchema;
    }

    public Page<ProjectSchema> findAll(Pageable Pageable) {
        return projectRepository.findAll(Pageable).map(projectEntity -> modelMapper.map(projectEntity, ProjectSchema.class));
    }

    public ProjectSchema findById(Integer projectId) {
        return modelMapper.map(projectRepository.findById(projectId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("project.not-found", null, LocaleContextHolder.getLocale()))), ProjectSchema.class);
    }

    public ChangelogPayload<ProjectSchema> update(ProjectSchema newProjectSchema) {
        ProjectSchema oldProjectSchema = findById(newProjectSchema.getId());
        BeanUtils.copyProperties(oldProjectSchema, newProjectSchema,
            Stream.of(BeanUtils.getPropertyDescriptors(ProjectSchema.class)).filter(descriptor -> {
                try {
                    return !Objects.isNull(descriptor.getReadMethod().invoke(newProjectSchema));
                } catch (Exception exception) {
                    return true;
                }
            }).map(descriptor -> descriptor.getName()).toArray(String[]::new));
        projectRepository.save(modelMapper.map(newProjectSchema, ProjectEntity.class));
        return ChangelogPayload.<ProjectSchema>builder()
            .before(oldProjectSchema)
            .after(newProjectSchema)
            .build();
    }

}
