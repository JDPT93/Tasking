package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.IssueTypeEntity;

public interface IssueTypeRepository extends JpaRepository<IssueTypeEntity, Integer> {

}
