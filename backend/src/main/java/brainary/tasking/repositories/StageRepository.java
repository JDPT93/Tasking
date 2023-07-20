package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.StageEntity;

public interface StageRepository extends JpaRepository<StageEntity, Integer> {

}
