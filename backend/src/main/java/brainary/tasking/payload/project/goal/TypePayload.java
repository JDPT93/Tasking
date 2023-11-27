package brainary.tasking.payload.project.goal;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.project.ProjectPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.goal.type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypePayload implements Serializable {

	private Integer id;

	private ProjectPayload project;

	private String name;

	private String icon;

	private Integer color;

	@JsonIgnore
	private Boolean active;

}