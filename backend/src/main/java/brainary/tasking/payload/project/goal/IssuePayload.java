package brainary.tasking.payload.project.goal;

import java.time.LocalDate;

import brainary.tasking.payload.project.stage.StagePayload;
import brainary.tasking.payload.user.UserPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Issue")
public class IssuePayload extends GoalPayload {

    @Valid
    @NotNull(message = "{project.goal.issue.field.parent.not-null}")
    private GoalPayload parent;

    @NotNull(message = "{project.goal.issue.field.priority.not-null}")
    private PriorityPayload priority;

    @NotNull(message = "{project.goal.issue.field.complexity.not-null}")
    private Integer complexity;

    @NotNull(message = "{project.goal.issue.field.start.not-null}")
    private LocalDate start;

    @NotNull(message = "{project.goal.issue.field.end.not-null}")
    private LocalDate end;

    @NotNull(message = "{project.goal.issue.field.reporter.not-null}")
    private UserPayload reporter;

    @NotNull(message = "{project.goal.issue.field.assignee.not-null}")
    private UserPayload assignee;

    @NotNull(message = "{project.goal.issue.field.stage.not-null}")
    private StagePayload stage;

}