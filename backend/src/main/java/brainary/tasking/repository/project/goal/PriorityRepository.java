package brainary.tasking.repository.project.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entities.project.goal.PriorityEntity;

@Repository(value = "repository:project:goal:priority")
public interface PriorityRepository extends JpaRepository<PriorityEntity, Integer>, JpaSpecificationExecutor<PriorityEntity> {

}
