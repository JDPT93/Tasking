package brainary.tasking.repository.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.CollaborationEntity;

@Repository(value = "repository.project.collaboration")
public interface CollaborationRepository extends JpaRepository<CollaborationEntity, Integer>, JpaSpecificationExecutor<CollaborationEntity> {

}
