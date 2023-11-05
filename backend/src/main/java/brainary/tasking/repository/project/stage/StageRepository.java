package brainary.tasking.repository.project.stage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.stage.StageEntity;

@Repository(value = "repository:project:stage")
public interface StageRepository extends JpaRepository<StageEntity, Integer>, JpaSpecificationExecutor<StageEntity> {

}
