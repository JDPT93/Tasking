package brainary.tasking.payload.project;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.iteration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IterationPayload {

	private Integer id;

	private ProjectPayload project;

	private String name;

	private String description;

	@JsonIgnore
	private Boolean active;

}
