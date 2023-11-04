package brainary.tasking.payload;

import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Authentication")
public class AuthenticationPayload implements Serializable {

    @NotBlank(message = "{user.field.email.not-blank}")
    @Email(message = "{user.field.email.email}")
    private String email;

    @NotNull(message = "{user.field.password.not-null}")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])[0-9A-Za-z@$!%*?&]{8,16}$", message = "{user.field.password.pattern}")
    private String password;

}
