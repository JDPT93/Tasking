package brainary.tasking.service.project.stage;

import java.util.List;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.stage.StageEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.stage.StagePayload;
import brainary.tasking.repository.project.stage.StageRepository;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.TypeValidator;
import brainary.tasking.validator.project.stage.StageValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;

@Service(value = "service.project.stage")
public class StageService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private StageRepository stageRepository;

	@Autowired
	private StageValidator stageValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private TypeValidator typeValidator;

	public StagePayload create(StagePayload stagePayload) {
		stagePayload.setId(null);
		stagePayload.setActive(true);
		if (!projectValidator.isActive(stagePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
		}
		if (!typeValidator.isActive(stagePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.not-found");
		}
		if (stageValidator.isConflicting(stagePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.conflict");
		}
		return modelMapper.map(stageRepository.save(modelMapper.map(stagePayload, StageEntity.class)), StagePayload.class);
	}

	public Page<StagePayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!projectValidator.isActive(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return stageRepository.findAll((stage, query, builder) -> {
			Join<?, ?> project = stage.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(stage.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, StagePayload.class));
	}

	@Transactional
	public List<ChangelogPayload<StagePayload>> update(StagePayload newStagePayload) {
		if (!projectValidator.isActive(newStagePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.not-found");
		}
		if (!typeValidator.isActive(newStagePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.type.not-found");
		}
		if (stageValidator.isConflicting(newStagePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.conflict");
		}
		return stageRepository.findOne((stage, query, builder) -> {
			Predicate equalId = builder.equal(stage.get("id"), newStagePayload.getId());
			Predicate isActive = builder.isTrue(stage.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(stageEntity -> {
				StagePayload oldStagePayload = modelMapper.map(stageEntity, StagePayload.class);
				newStagePayload.setActive(true);
				stageRepository.save(modelMapper.map(newStagePayload, StageEntity.class));
				ChangelogPayload<StagePayload> changelogPayload = new ChangelogPayload<>(oldStagePayload, newStagePayload);
				Integer difference = newStagePayload.getIndex() - oldStagePayload.getIndex();
				if (difference == 0) {
					return List.of(changelogPayload);
				}
				Integer direction = difference < 0 ? -1 : +1;
				return Stream.concat(Stream.of(changelogPayload), stageRepository.findAll((stage, query, builder) -> {
					Join<?, ?> project = stage.join("project");
					Predicate notEqualId = builder.notEqual(stage.get("id"), newStagePayload.getId());
					Predicate equalProject = builder.equal(project.get("id"), newStagePayload.getProject().getId());
					Predicate isActive = builder.isTrue(stage.get("active"));
					Predicate betweenIndex = direction < 0
						? builder.between(stage.get("index"), newStagePayload.getIndex(), oldStagePayload.getIndex())
						: builder.between(stage.get("index"), oldStagePayload.getIndex(), newStagePayload.getIndex());
					return builder.and(notEqualId, equalProject, betweenIndex, isActive);
				})
					.stream()
					.map(adjacentStageEntity -> {
						StagePayload oldAdjacentStagePayload = modelMapper.map(adjacentStageEntity, StagePayload.class);
						adjacentStageEntity.setIndex(adjacentStageEntity.getIndex() - direction);
						StagePayload newAdjacentStagePayload = modelMapper.map(stageRepository.save(adjacentStageEntity), StagePayload.class);
						return new ChangelogPayload<StagePayload>(oldAdjacentStagePayload, newAdjacentStagePayload);
					}))
					.toList();
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found"));

	}

	public StagePayload deleteById(Integer stageId) {
		return stageRepository.findOne((stage, query, builder) -> {
			Predicate equalId = builder.equal(stage.get("id"), stageId);
			Predicate isActive = builder.isTrue(stage.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(stageEntity -> {
				stageEntity.setActive(false);
				return modelMapper.map(stageRepository.save(stageEntity), StagePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found"));
	}

}
