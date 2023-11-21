package brainary.tasking.repository.project.goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import brainary.tasking.entity.project.goal.IssueEntity;

@Repository(value = "repository.project.goal.issue")
public interface IssueRepository extends JpaRepository<IssueEntity, Integer>, JpaSpecificationExecutor<IssueEntity> {

}
