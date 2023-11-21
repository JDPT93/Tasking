package brainary.tasking.service.project.goal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.goal.IssueEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.IssuePayload;
import brainary.tasking.repository.project.goal.IssueRepository;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.IssueValidator;
import brainary.tasking.validator.project.goal.PriorityValidator;
import brainary.tasking.validator.project.goal.TypeValidator;
import brainary.tasking.validator.project.stage.StageValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.goal.issue")
public class IssueService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private IssueRepository issueRepository;

	@Autowired
	private IssueValidator issueValidator;

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

	public ChangelogPayload<IssuePayload> update(IssuePayload newIssuePayload) {
		if (!projectValidator.isActive(newIssuePayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (!issueValidator.isActive(newIssuePayload.getParent().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
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
				return new ChangelogPayload<IssuePayload>(oldIssuePayload, newIssuePayload);
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
