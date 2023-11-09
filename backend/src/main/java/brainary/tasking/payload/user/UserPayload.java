package brainary.tasking.payload.user;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "user")
public class UserPayload implements Serializable {

	private Integer id;

	private String name;

	private String email;

	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;

	@JsonIgnore
	private Boolean active;

}
