package brainary.tasking.payload.project.goal.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.stage.transition")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransitionPayload implements Serializable {

	private Integer id;

	private StagePayload source;

	private StagePayload target;

	private String label;

	@JsonIgnore
	private Boolean active;

}