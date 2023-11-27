package brainary.tasking.service.project;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entity.project.IterationEntity;
import brainary.tasking.payload.common.ChangelogPayload;
import brainary.tasking.payload.project.IterationPayload;
import brainary.tasking.repository.project.IterationRepository;
import brainary.tasking.validator.project.IterationValidator;
import brainary.tasking.validator.project.ProjectValidator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

@Service(value = "project.iteration.iteration")
public class IterationService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private IterationRepository iterationRepository;

	@Autowired
	private IterationValidator iterationValidator;

	@Autowired
	private ProjectValidator projectValidator;

	public IterationPayload create(IterationPayload iterationPayload) {
		iterationPayload.setId(null);
		iterationPayload.setActive(true);
		if (!projectValidator.isActive(iterationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (iterationValidator.isConflicting(iterationPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.iteration.conflict");
		}
		return modelMapper.map(iterationRepository.save(modelMapper.map(iterationPayload, IterationEntity.class)), IterationPayload.class);
	}

	public Page<IterationPayload> retrieveByProjectId(Integer projectId, Pageable pageable) {
		return iterationRepository.findAll((iteration, query, builder) -> {
			Join<?, ?> project = iteration.join("project");
			Predicate equalProject = builder.equal(project.get("id"), projectId);
			Predicate isActive = builder.isTrue(iteration.get("active"));
			return builder.and(equalProject, isActive);
		}, pageable)
			.map(iterationEntity -> modelMapper.map(iterationEntity, IterationPayload.class));
	}

	public ChangelogPayload<IterationPayload> update(IterationPayload newIterationPayload) {
		if (!projectValidator.isActive(newIterationPayload.getProject().getId())) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "project.not-found");
		}
		if (iterationValidator.isConflicting(newIterationPayload)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "project.iteration.conflict");
		}
		return iterationRepository.findOne((iteration, query, builder) -> {
			Predicate equalId = builder.equal(iteration.get("id"), newIterationPayload.getId());
			Predicate isActive = builder.isTrue(iteration.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(iterationEntity -> {
				IterationPayload oldIterationPayload = modelMapper.map(iterationEntity, IterationPayload.class);
				newIterationPayload.setActive(true);
				iterationRepository.save(modelMapper.map(newIterationPayload, IterationEntity.class));
				return new ChangelogPayload<IterationPayload>(oldIterationPayload, newIterationPayload);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.iteration.not-found"));
	}

	public IterationPayload deleteById(Integer iterationId) {
		return iterationRepository.findOne((iteration, query, builder) -> {
			Predicate equalId = builder.equal(iteration.get("id"), iterationId);
			Predicate isActive = builder.isTrue(iteration.get("active"));
			return builder.and(equalId, isActive);
		})
			.map(iterationEntity -> {
				iterationEntity.setActive(false);
				return modelMapper.map(iterationRepository.save(iterationEntity), IterationPayload.class);
			})
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project.iteration.not-found"));
	}

}
