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
import brainary.tasking.repository.project.stage.TransitionRepository;
import brainary.tasking.validator.project.stage.StageValidator;
import brainary.tasking.validator.project.stage.TransitionValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "project.stage.transition")
public class TransitionService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private TransitionRepository transitionRepository;

	@Autowired
	private TransitionValidator transitionValidator;

	@Autowired
	private StageValidator stageValidator;

	public TransitionPayload create(TransitionPayload transitionPayload) {
		transitionPayload.setId(null);
		transitionPayload.setActive(true);
		if (!stageValidator.isActive(transitionPayload.getSource().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.source.not-found");
		}
		if (!stageValidator.isActive(transitionPayload.getTarget().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.target.not-found");
		}
		if (transitionValidator.isConflicting(transitionPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.transition.conflict");
		}
		return modelMapper.map(transitionRepository.save(modelMapper.map(transitionPayload, TransitionEntity.class)), TransitionPayload.class);
	}

	public Page<IssuePayload> retrieveByProjectId(Integer stageId, Pageable pageable) {
		if (!stageValidator.isActive(stageId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return transitionRepository.findAll((transition, query, builder) -> {
			Join<?, ?> stage = transition.join("stage");
			Predicate equalStage = builder.equal(stage.get("id"), stageId);
			Predicate isActive = builder.isTrue(transition.get("active"));
			return builder.and(equalStage, isActive);
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, IssuePayload.class));
	}

	public ChangelogPayload<TransitionPayload> update(TransitionPayload newTransitionPayload) {
		if (!stageValidator.isActive(newTransitionPayload.getSource().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.source.not-found");
		}
		if (!stageValidator.isActive(newTransitionPayload.getTarget().getId())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.target.not-found");
		}
		if (transitionValidator.isConflicting(newTransitionPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.stage.transition.conflict");
		}
		return transitionRepository.findOne((transition, query, builder) -> {
			Predicate equalId = builder.equal(transition.get("id"), newTransitionPayload.getId());
			Predicate isActive = builder.isTrue(transition.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(transitionEntity -> {
				TransitionPayload oldTransitionPayload = modelMapper.map(transitionEntity, TransitionPayload.class);
				newTransitionPayload.setActive(true);
				transitionRepository.save(modelMapper.map(newTransitionPayload, TransitionEntity.class));
				return new ChangelogPayload<TransitionPayload>(oldTransitionPayload, newTransitionPayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.transition.not-found"));
	}

	public TransitionPayload deleteById(Integer transitionId) {
		return transitionRepository.findOne((transition, query, builder) -> {
			Predicate equalId = builder.equal(transition.get("id"), transitionId);
			Predicate isActive = builder.isTrue(transition.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(transitionEntity -> {
				transitionEntity.setActive(false);
				return modelMapper.map(transitionRepository.save(transitionEntity), TransitionPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.transition.not-found"));
	}

}
