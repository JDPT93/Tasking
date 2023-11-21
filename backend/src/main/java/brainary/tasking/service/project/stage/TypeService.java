package brainary.tasking.service.project.stage;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import brainary.tasking.payload.project.stage.TypePayload;
import brainary.tasking.repository.project.stage.TypeRepository;
import jakarta.persistence.criteria.Predicate;

@Service(value = "service.project.stage.type")
public class TypeService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private TypeRepository typeRepository;

	public Page<TypePayload> retrieveAll(Pageable pageable) {
		return typeRepository.findAll((type, query, builder) -> {
			Predicate isActive = builder.isTrue(type.get("active"));
			return isActive;
		}, pageable)
			.map(typeEntity -> modelMapper.map(typeEntity, TypePayload.class));
	}

}
