package brainary.tasking.payload.project;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.user.UserPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "project.collaboration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationPayload implements Serializable {

	private Integer id;

	private ProjectPayload project;

	private UserPayload collaborator;

	@JsonIgnore
	private Boolean active;

}
