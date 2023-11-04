package brainary.tasking.repository.project.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entities.project.goal.GoalEntity;

@Repository(value = "repository:project:goal")
public interface GoalRepository extends JpaRepository<GoalEntity, Integer>, JpaSpecificationExecutor<GoalEntity> {

}
