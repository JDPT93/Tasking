package brainary.tasking.repository.project.stage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entities.project.stage.TransitionEntity;

@Repository(value = "repository:project:stage:transition")
public interface TransitionRepository extends JpaRepository<TransitionEntity, Integer>, JpaSpecificationExecutor<TransitionEntity> {

}
