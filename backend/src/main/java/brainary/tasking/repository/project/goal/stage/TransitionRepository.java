package brainary.tasking.repository.project.goal.stage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.goal.stage.TransitionEntity;

@Repository(value = "repository.project.stage.transition")
public interface TransitionRepository extends JpaRepository<TransitionEntity, Integer>, JpaSpecificationExecutor<TransitionEntity> {

}
