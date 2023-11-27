package brainary.tasking.payload.project.goal;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.goal.priority")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PriorityPayload implements Serializable {

	private Integer id;

	private String name;

	@JsonIgnore
	private Boolean active;

}