package brainary.tasking.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import brainary.tasking.entities.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

    @Query(value = "SELECT DISTINCT project FROM ProjectEntity project WHERE project.leader.id = :memberId OR :memberId IN (SELECT collaboration.collaborator.id FROM project.collaborations collaboration)")
    Page<ProjectEntity> findByMemberId(@Param(value = "memberId") Integer memberId, Pageable pageable);

    @Query(value = "SELECT DISTINCT project FROM ProjectEntity project WHERE project.id = :projectId AND (project.leader.id = :memberId OR :memberId IN (SELECT collaboration.collaborator.id FROM project.collaborations collaboration))")
    Optional<ProjectEntity> findByIdAndMemberId(@Param(value = "projectId") Integer projectId, @Param(value = "memberId") Integer memberId);

}
