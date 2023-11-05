package brainary.tasking.service.project.stage;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.stage.StageEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.payload.project.stage.StagePayload;
import brainary.tasking.repository.project.ProjectRepository;
import brainary.tasking.repository.project.stage.StageRepository;
import brainary.tasking.repository.project.stage.TypeRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service:project:stage")
public class StageService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TypeRepository typeRepository;

    private Boolean isActiveProject(Integer projectId) {
        return projectRepository.exists((root, query, builder) -> {
            Predicate equalId = builder.equal(root.get("id"), projectId);
            Predicate isActive = builder.isTrue(root.get("active"));
            return builder.and(equalId, isActive);
        });
    }

    private Boolean isActiveType(Integer typeId) {
        return typeRepository.exists((root, query, builder) -> {
            Predicate equalId = builder.equal(root.get("id"), typeId);
            Predicate isActive = builder.isTrue(root.get("active"));
            return builder.and(equalId, isActive);
        });
    }

    private Boolean isConflictingStage(StagePayload stagePayload) {
        return stageRepository.exists((root, query, builder) -> {
            Join<?, ?> project = root.join("project");
            Predicate equalProject = builder.equal(project.get("id"), stagePayload.getProject().getId());
            Predicate equalIndex = builder.equal(root.get("index"), stagePayload.getIndex());
            Predicate equalName = builder.equal(root.get("name"), stagePayload.getName());
            Predicate isActive = builder.isTrue(root.get("active"));
            if (stagePayload.getId() == null) {
                return builder.and(equalProject, builder.or(equalIndex, equalName), isActive);
            }
            Predicate notEqualId = builder.notEqual(root.get("id"), stagePayload.getId());
            return builder.and(notEqualId, equalProject, builder.or(equalIndex, equalName), isActive);
        });
    }

    public StagePayload create(StagePayload stagePayload) {
        stagePayload.setId(null);
        stagePayload.setActive(true);
        if (!isActiveProject(stagePayload.getProject().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
        }
        if (!isActiveType(stagePayload.getType().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.not-found");
        }
        if (isConflictingStage(stagePayload)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.conflict");
        }
        return modelMapper.map(stageRepository.save(modelMapper.map(stagePayload, StageEntity.class)), StagePayload.class);
    }

    public Page<IssuePayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
        if (!isActiveProject(projectId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
        }
        return stageRepository.findAll((root, query, builder) -> {
            Join<?, ?> project = root.join("project");
            Predicate equalProject = builder.equal(project.get("id"), projectId);
            Predicate isActive = builder.isTrue(root.get("active"));
            return builder.and(equalProject, isActive);
        }, pageable)
            .map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
    }

    public ChangelogPayload<StagePayload> update(StagePayload stagePayload) {
        if (!isActiveProject(stagePayload.getProject().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
        }
        if (!isActiveType(stagePayload.getType().getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.not-found");
        }
        if (isConflictingStage(stagePayload)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.conflict");
        }
        return new ChangelogPayload<StagePayload>(stageRepository.findOne((root, query, builder) -> {
            Predicate equalId = builder.equal(root.get("id"), stagePayload.getId());
            Predicate isActive = builder.isTrue(root.get("active"));
            return builder.and(equalId, isActive);
        })
            .map(stageEntity -> {
                StagePayload previousStagePayload = modelMapper.map(stageEntity, StagePayload.class);
                stagePayload.setActive(true);
                stageRepository.save(modelMapper.map(stagePayload, StageEntity.class));
                return previousStagePayload;
            }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found")),
            stagePayload);
    }

    public StagePayload deleteById(Integer stageId) {
        return stageRepository.findOne((root, query, builder) -> {
            Predicate equalId = builder.equal(root.get("id"), stageId);
            Predicate isActive = builder.isTrue(root.get("active"));
            return builder.and(equalId, isActive);
        })
            .map(stageEntity -> {
                stageEntity.setActive(false);
                return modelMapper.map(stageRepository.save(stageEntity), StagePayload.class);
            })
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found"));
    }

}
