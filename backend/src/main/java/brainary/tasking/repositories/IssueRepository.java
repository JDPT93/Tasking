package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.IssueEntity;

public interface IssueRepository extends JpaRepository<IssueEntity, Integer> {

}
