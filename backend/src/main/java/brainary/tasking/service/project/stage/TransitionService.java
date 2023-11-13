package brainary.tasking.service.project.stage;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.stage.TransitionEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.payload.project.stage.TransitionPayload;
import brainary.tasking.repository.project.stage.StageRepository;
import brainary.tasking.repository.project.stage.TransitionRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "project.stage.transition")
public class TransitionService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private TransitionRepository transitionRepository;

	@Autowired
	private StageRepository stageRepository;

	private Boolean isValidStage(Integer stageId) {
		return stageRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), stageId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isConflictingTransition(TransitionPayload transitionPayload) {
		return transitionRepository.exists((root, query, builder) -> {
			Join<?, ?> source = root.join("source");
			Join<?, ?> target = root.join("target");
			Predicate equalSource = builder.equal(source.get("id"), transitionPayload.getSource().getId());
			Predicate equalTarget = builder.equal(target.get("id"), transitionPayload.getTarget().getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (transitionPayload.getId() == null) {
				return builder.and(equalSource, equalTarget, isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), transitionPayload.getId());
			return builder.and(notEqualId, equalSource, equalTarget, isActive);
		});
	}

	public TransitionPayload create(TransitionPayload transitionPayload) {
		transitionPayload.setId(null);
		transitionPayload.setActive(true);
		if (!isValidStage(transitionPayload.getSource().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.source.not-found");
		}
		if (!isValidStage(transitionPayload.getTarget().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.target.not-found");
		}
		if (isConflictingTransition(transitionPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.transition.conflict");
		}
		return modelMapper.map(transitionRepository.save(modelMapper.map(transitionPayload, TransitionEntity.class)), TransitionPayload.class);
	}

	public Page<IssuePayload> retrieveByProjectId(Integer stageId, Pageable pageable) {
		if (!isValidStage(stageId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return transitionRepository.findAll((root, query, builder) -> {
			Join<?, ?> stage = root.join("stage");
			Predicate equalStage = builder.equal(stage.get("id"), stageId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalStage, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public ChangelogPayload<TransitionPayload> update(TransitionPayload transitionPayload) {
		if (!isValidStage(transitionPayload.getSource().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.source.not-found");
		}
		if (!isValidStage(transitionPayload.getTarget().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.target.not-found");
		}
		if (isConflictingTransition(transitionPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.transition.conflict");
		}
		return new ChangelogPayload<TransitionPayload>(transitionRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), transitionPayload.getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(transitionEntity -> {
				TransitionPayload previousTransitionPayload = modelMapper.map(transitionEntity, TransitionPayload.class);
				transitionPayload.setActive(true);
				transitionRepository.save(modelMapper.map(transitionPayload, TransitionEntity.class));
				return previousTransitionPayload;
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.transition.not-found")),
			transitionPayload);
	}

	public TransitionPayload deleteById(Integer transitionId) {
		return transitionRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), transitionId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(transitionEntity -> {
				transitionEntity.setActive(false);
				return modelMapper.map(transitionRepository.save(transitionEntity), TransitionPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.transition.not-found"));
	}

}
