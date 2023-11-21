package brainary.tasking.payload.user;

import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "user.authorization")
public class AuthorizationPayload implements Serializable {

	private UserPayload user;

	private String token;

}
