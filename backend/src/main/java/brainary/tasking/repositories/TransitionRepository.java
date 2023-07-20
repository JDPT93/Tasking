package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.TransitionEntity;

public interface TransitionRepository extends JpaRepository<TransitionEntity, Integer> {

}
