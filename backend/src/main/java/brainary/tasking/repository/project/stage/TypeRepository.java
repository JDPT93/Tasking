package brainary.tasking.repository.project.stage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.stage.TypeEntity;

@Repository(value = "repository:project:stage:type")
public interface TypeRepository extends JpaRepository<TypeEntity, Integer>, JpaSpecificationExecutor<TypeEntity> {

}
