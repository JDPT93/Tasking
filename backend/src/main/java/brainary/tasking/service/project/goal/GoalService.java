package brainary.tasking.service.project.goal;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.goal.GoalEntity;
import brainary.tasking.payload.ChangelogPayload;
import brainary.tasking.payload.project.goal.GoalPayload;
import brainary.tasking.repository.project.goal.GoalRepository;
import brainary.tasking.validator.project.ProjectValidator;
import brainary.tasking.validator.project.goal.GoalValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.goal")
public class GoalService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private GoalRepository goalRepository;

	@Autowired
	private GoalValidator goalValidator;

	@Autowired
	private ProjectValidator projectValidator;

	public GoalPayload create(GoalPayload goalPayload) {
		goalPayload.setId(null);
		goalPayload.setActive(true);
		if (!projectValidator.isActive(goalPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (goalValidator.isConflicting(goalPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.conflict");
		}
		return modelMapper.map(goalRepository.save(modelMapper.map(goalPayload, GoalEntity.class)), GoalPayload.class);
	}

	public Page<GoalPayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		if (!projectValidator.isActive(projectId)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		return goalRepository.findAll((goal, query, builder) -> {
			Join<?, ?> project = goal.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(goal.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(goalEntity -> modelMapper.map(goalEntity, GoalPayload.class));
	}

	public ChangelogPayload<GoalPayload> update(GoalPayload newGoalPayload) {
		if (!projectValidator.isActive(newGoalPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (goalValidator.isConflicting(newGoalPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.goal.conflict");
		}
		return goalRepository.findOne((goal, query, builder) -> {
			Predicate equalId = builder.equal(goal.get("id"), newGoalPayload.getId());
			Predicate isActive = builder.isTrue(goal.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(goalEntity -> {
				GoalPayload oldGoalPayload = modelMapper.map(goalEntity, GoalPayload.class);
				newGoalPayload.setActive(true);
				goalRepository.save(modelMapper.map(newGoalPayload, GoalEntity.class));
				return new ChangelogPayload<GoalPayload>(oldGoalPayload, newGoalPayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.not-found"));
	}

	public GoalPayload deleteById(Integer goalId) {
		return goalRepository.findOne((goal, query, builder) -> {
			Predicate equalId = builder.equal(goal.get("id"), goalId);
			Predicate isActive = builder.isTrue(goal.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(goalEntity -> {
				goalEntity.setActive(false);
				return modelMapper.map(goalRepository.save(goalEntity), GoalPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.goal.not-found"));
	}

}
