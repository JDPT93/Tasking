package brainary.tasking.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.IterationEntity;

@Repository(value = "repository.project.iteration")
public interface IterationRepository extends JpaRepository<IterationEntity, Integer>, JpaSpecificationExecutor<IterationEntity> {

}
