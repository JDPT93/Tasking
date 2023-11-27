package brainary.tasking.service.project.goal;

import java.util.List;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.goal.IssueEntity;
import brainary.tasking.payload.common.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.repository.project.goal.IssueRepository;
import brainary.tasking.validator.project.IterationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.IssueValidator;
import brainary.tasking.validator.project.goal.PriorityValidator;
import brainary.tasking.validator.project.goal.TypeValidator;
import brainary.tasking.validator.project.goal.stage.StageValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;

@Service(value = "service.project.goal.issue")
public class IssueService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private IssueRepository issueRepository;

	@Autowired
	private IssueValidator issueValidator;

	@Autowired
	private IterationValidator iterationValidator;

	@Autowired
	private ProjectValidator projectValidator;

	@Autowired
	private TypeValidator typeValidator;

	@Autowired
	private PriorityValidator priorityValidator;

	@Autowired
	private StageValidator stageValidator;

	public IssuePayload create(IssuePayload issuePayload) {
		issuePayload.setId(null);
		issuePayload.setActive(true);
		if (!projectValidator.isActive(issuePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (!issueValidator.isActive(issuePayload.getParent().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		if (!iterationValidator.isActive(issuePayload.getIteration().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.iteration.not-found");
		}
		if (!typeValidator.isActive(issuePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found");
		}
		if (!priorityValidator.isActive(issuePayload.getPriority().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.priority.not-found");
		}
		if (!stageValidator.isActive(issuePayload.getStage().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found");
		}
		if (issueValidator.isConflicting(issuePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.issue.conflict");
		}
		return modelMapper.map(issueRepository.save(modelMapper.map(issuePayload, IssueEntity.class)), IssuePayload.class);
	}

	public IssuePayload retrieveById(Integer issueId) {
		return issueRepository.findOne((issue, query, builder) -> {
			Predicate equalId = builder.equal(issue.get("id"), issueId);
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(issueEntity -> modelMapper.map(issueEntity, IssuePayload.class))
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found"));
	}

	public Page<IssuePayload> retrieveByIterationId(Integer iterationId, Pageable pageable) {
		if (!iterationValidator.isActive(iterationId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.iteration.not-found");
		}
		return issueRepository.findAll((issue, query, builder) -> {
			Join<?, ?> iteration = issue.join("iteration");
			Predicate equalIteration = builder.equal(iteration.get("id"), iterationId);
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalIteration, isActive);
		}, pageable)
			.map(issueEntity -> modelMapper.map(issueEntity, IssuePayload.class));
	}

	public Page<IssuePayload> retrieveByParentId(Integer parentId, Pageable pageable) {
		if (!issueValidator.isActive(parentId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		return issueRepository.findAll((issue, query, builder) -> {
			Predicate equalParent;
			if (parentId == null) {
				equalParent = builder.isNull(issue.get("parent"));
			} else {
				Join<?, ?> parent = issue.join("parent");
				equalParent = builder.equal(parent.get("id"), parentId);
			}
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalParent, isActive);
		}, pageable)
			.map(issueEntity -> modelMapper.map(issueEntity, IssuePayload.class));
	}

	public Page<IssuePayload> retrieveByStageId(Integer stageId, Pageable pageable) {
		if (!stageValidator.isActive(stageId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found");
		}
		return issueRepository.findAll((issue, query, builder) -> {
			Join<?, ?> stage = issue.join("stage");
			Predicate equalStage = builder.equal(stage.get("id"), stageId);
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalStage, isActive);
		}, pageable)
			.map(issueEntity -> modelMapper.map(issueEntity, IssuePayload.class));
	}

	@Transactional
	public List<ChangelogPayload<IssuePayload>> update(IssuePayload newIssuePayload) {
		if (!projectValidator.isActive(newIssuePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (!issueValidator.isActive(newIssuePayload.getParent().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		if (!iterationValidator.isActive(newIssuePayload.getIteration().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.iteration.not-found");
		}
		if (!typeValidator.isActive(newIssuePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found");
		}
		if (!priorityValidator.isActive(newIssuePayload.getPriority().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.priority.not-found");
		}
		if (!stageValidator.isActive(newIssuePayload.getStage().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.stage.not-found");
		}
		if (issueValidator.isConflicting(newIssuePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.issue.conflict");
		}
		return issueRepository.findOne((issue, query, builder) -> {
			Predicate equalId = builder.equal(issue.get("id"), newIssuePayload.getId());
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(issueEntity -> {
				IssuePayload oldIssuePayload = modelMapper.map(issueEntity, IssuePayload.class);
				newIssuePayload.setActive(true);
				issueRepository.save(modelMapper.map(newIssuePayload, IssueEntity.class));
				ChangelogPayload<IssuePayload> changelogPayload = new ChangelogPayload<>(oldIssuePayload, newIssuePayload);
				if (newIssuePayload.getStage().getId() == oldIssuePayload.getStage().getId()) {
					Integer difference = newIssuePayload.getIndex() - oldIssuePayload.getIndex();
					if (difference == 0) {
						return List.of(changelogPayload);
					}
					Integer direction = difference < 0 ? -1 : +1;
					return Stream.concat(Stream.of(changelogPayload), issueRepository.findAll((issue, query, builder) -> {
						Join<?, ?> stage = issue.join("stage");
						Predicate equalStage = builder.equal(stage.get("id"), newIssuePayload.getStage().getId());
						Predicate notEqualId = builder.notEqual(issue.get("id"), newIssuePayload.getId());
						Predicate isActive = builder.isTrue(issue.get("active"));
						Predicate betweenIndex = direction < 0
							? builder.between(issue.get("index"), newIssuePayload.getIndex(), oldIssuePayload.getIndex())
							: builder.between(issue.get("index"), oldIssuePayload.getIndex(), newIssuePayload.getIndex());
						return builder.and(equalStage, notEqualId, isActive, betweenIndex);
					})
						.stream()
						.map(affectedIssueEntity -> {
							IssuePayload oldAffectedIssuePayload = modelMapper.map(affectedIssueEntity, IssuePayload.class);
							affectedIssueEntity.setIndex(affectedIssueEntity.getIndex() - direction);
							IssuePayload newAffectedIssuePayload = modelMapper.map(issueRepository.save(affectedIssueEntity), IssuePayload.class);
							return new ChangelogPayload<>(oldAffectedIssuePayload, newAffectedIssuePayload);
						}))
						.toList();
				} else {
					return Stream.concat(
						Stream.of(changelogPayload),
						Stream.concat(
							issueRepository.findAll((issue, query, builder) -> {
								Join<?, ?> stage = issue.join("stage");
								Predicate equalStage = builder.equal(stage.get("id"), oldIssuePayload.getStage().getId());
								Predicate greaterIndex = builder.greaterThan(issue.get("index"), oldIssuePayload.getIndex());
								Predicate isActive = builder.isTrue(issue.get("active"));
								return builder.and(equalStage, greaterIndex, isActive);
							}).stream().map(affectedIssueEntity -> {
								IssuePayload oldAffectedIssuePayload = modelMapper.map(affectedIssueEntity, IssuePayload.class);
								affectedIssueEntity.setIndex(affectedIssueEntity.getIndex() - 1);
								IssuePayload newAffectedIssuePayload = modelMapper.map(issueRepository.save(affectedIssueEntity), IssuePayload.class);
								return new ChangelogPayload<>(oldAffectedIssuePayload, newAffectedIssuePayload);
							}),
							issueRepository.findAll((issue, query, builder) -> {
								Join<?, ?> stage = issue.join("stage");
								Predicate equalStage = builder.equal(stage.get("id"), newIssuePayload.getStage().getId());
								Predicate greaterOrEqualIndex = builder.greaterThanOrEqualTo(issue.get("index"), newIssuePayload.getIndex());
								Predicate isActive = builder.isTrue(issue.get("active"));
								return builder.and(equalStage, greaterOrEqualIndex, isActive);
							}).stream().map(affectedIssueEntity -> {
								IssuePayload oldAffectedIssuePayload = modelMapper.map(affectedIssueEntity, IssuePayload.class);
								affectedIssueEntity.setIndex(affectedIssueEntity.getIndex() + 1);
								IssuePayload newAffectedIssuePayload = modelMapper.map(issueRepository.save(affectedIssueEntity), IssuePayload.class);
								return new ChangelogPayload<>(oldAffectedIssuePayload, newAffectedIssuePayload);
							})))
						.toList();
				}
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found"));
	}

	public IssuePayload deleteById(Integer issueId) {
		return issueRepository.findOne((issue, query, builder) -> {
			Predicate equalId = builder.equal(issue.get("id"), issueId);
			Predicate isActive = builder.isTrue(issue.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(issueEntity -> {
				issueEntity.setActive(false);
				return modelMapper.map(issueRepository.save(issueEntity), IssuePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found"));
	}

}
