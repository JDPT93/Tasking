package brainary.tasking.payload.project.goal;

import java.time.LocalDate;

import brainary.tasking.payload.common.IntervalPayload;
import brainary.tasking.payload.project.IterationPayload;
import brainary.tasking.payload.project.goal.stage.StagePayload;
import brainary.tasking.payload.user.UserPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.goal.issue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssuePayload extends GoalPayload {

	private GoalPayload parent;

	private IterationPayload iteration;

	private TypePayload type;

	private PriorityPayload priority;

	private String description;

	private Integer complexity;

	private IntervalPayload<LocalDate> period;

	private UserPayload reporter;

	private UserPayload assignee;

	private StagePayload stage;

}