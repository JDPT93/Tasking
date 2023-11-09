package brainary.tasking.payload.project.goal;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "project:goal")
public class GoalPayload implements Serializable {

	private Integer id;

	private TypePayload type;

	private PriorityPayload priority;

	private Integer index;

	private String name;

	private String description;

	@JsonIgnore
	private Boolean active;

}