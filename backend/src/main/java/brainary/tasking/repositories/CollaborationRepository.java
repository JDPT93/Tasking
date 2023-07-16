package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.CollaborationEntity;

public interface CollaborationRepository extends JpaRepository<CollaborationEntity, Integer> {

}
