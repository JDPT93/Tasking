package brainary.tasking.entity.project.goal;

import java.time.LocalDate;

import brainary.tasking.entity.common.IntervalEntity;
import brainary.tasking.entity.project.stage.StageEntity;
import brainary.tasking.entity.user.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "project:goal:issue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueEntity extends GoalEntity {

    @ManyToOne
    @JoinColumn(nullable = true)
    private GoalEntity parent;

    @Column(nullable = false)
    private Integer complexity;

    @Embedded
    private IntervalEntity<LocalDate> period;

    @ManyToOne
    @JoinColumn(nullable = false)
    private UserEntity reporter;

    @ManyToOne
    @JoinColumn(nullable = false)
    private UserEntity assignee;

    @ManyToOne
    @JoinColumn(nullable = false)
    private StageEntity stage;

}