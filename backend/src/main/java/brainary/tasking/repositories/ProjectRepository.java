package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

}
