package brainary.tasking.payload.project.goal.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.project.ProjectPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.stage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StagePayload implements Serializable {

	private Integer id;

	private ProjectPayload project;

	private TypePayload type;

	private String name;

	private Integer index;

	@JsonIgnore
	private Boolean active;

}