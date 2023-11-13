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
import brainary.tasking.repository.project.goal.TypeRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.goal.issue")
public class IssueService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private IssueRepository issueRepository;

	@Autowired
	private TypeRepository typeRepository;

	private Boolean isValidType(Integer typeId) {
		return typeRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), typeId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isValidIssue(Integer issueId) {
		return issueRepository.exists((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), issueId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		});
	}

	private Boolean isConflictingIssue(IssuePayload issuePayload) {
		return issueRepository.exists((root, query, builder) -> {
			Predicate equalParent;
			if (issuePayload.getParent() == null) {
				equalParent = builder.isNull(root.get("parent"));
			} else {
				Join<?, ?> parent = root.join("parent");
				equalParent = builder.equal(parent.get("id"), issuePayload.getParent().getId());
			}
			Predicate equalIndex = builder.equal(root.get("index"), issuePayload.getIndex());
			Predicate equalName = builder.equal(root.get("name"), issuePayload.getName());
			Predicate equalDescription = builder.equal(root.get("description"), issuePayload.getName());
			Predicate isActive = builder.isTrue(root.get("active"));
			if (issuePayload.getId() == null) {
				return builder.and(equalParent, builder.or(equalIndex, equalName, equalDescription), isActive);
			}
			Predicate notEqualId = builder.notEqual(root.get("id"), issuePayload.getId());
			return builder.and(notEqualId, equalParent, builder.or(equalIndex, equalName, equalDescription), isActive);
		});
	}

	public IssuePayload create(IssuePayload issuePayload) {
		issuePayload.setId(null);
		issuePayload.setActive(true);
		if (!isValidType(issuePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found");
		}
		if (issuePayload.getParent().getId() != null && !isValidIssue(issuePayload.getParent().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		if (isConflictingIssue(issuePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.issue.conflict");
		}
		return modelMapper.map(issueRepository.save(modelMapper.map(issuePayload, IssueEntity.class)), IssuePayload.class);
	}

	public Page<IssuePayload> retrieveByParentId(Integer parentId, Pageable pageable) {
		if (parentId != null && !isValidIssue(parentId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		return issueRepository.findAll((root, query, builder) -> {
			Predicate equalParent;
			if (parentId == null) {
				equalParent = builder.isNull(root.get("parent"));
			} else {
				Join<?, ?> parent = root.join("parent");
				equalParent = builder.equal(parent.get("id"), parentId);
			}
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalParent, isActive);
		}, pageable)
			.map(issueEntity -> modelMapper.map(issueEntity, IssuePayload.class));
	}

	public ChangelogPayload<IssuePayload> update(IssuePayload issuePayload) {
		if (!isValidType(issuePayload.getType().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.type.not-found");
		}
		if (issuePayload.getParent().getId() != null && !isValidIssue(issuePayload.getParent().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found");
		}
		if (isConflictingIssue(issuePayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.issue.conflict");
		}
		return new ChangelogPayload<IssuePayload>(issueRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), issuePayload.getId());
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(issueEntity -> {
				IssuePayload previousIssuePayload = modelMapper.map(issueEntity, IssuePayload.class);
				issuePayload.setActive(true);
				issueRepository.save(modelMapper.map(issuePayload, IssueEntity.class));
				return previousIssuePayload;
			}).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found")),
			issuePayload);
	}

	public IssuePayload deleteById(Integer issueId) {
		return issueRepository.findOne((root, query, builder) -> {
			Predicate equalId = builder.equal(root.get("id"), issueId);
			Predicate isActive = builder.isTrue(root.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(issueEntity -> {
				issueEntity.setActive(false);
				return modelMapper.map(issueRepository.save(issueEntity), IssuePayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.issue.not-found"));
	}

}
