package brainary.tasking.repository.project.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.goal.TypeEntity;

@Repository(value = "repository:project:goal:type")
public interface TypeRepository extends JpaRepository<TypeEntity, Integer>, JpaSpecificationExecutor<TypeEntity> {

}
