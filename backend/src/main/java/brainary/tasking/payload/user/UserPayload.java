package brainary.tasking.payload.user;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

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
@Schema(name = "User")
public class UserPayload implements Serializable {

    private Integer id;

    @NotBlank(message = "{user.field.name.not-blank}")
    private String name;

    @NotBlank(message = "{user.field.email.not-blank}")
    @Email(message = "{user.field.email.pattern}")
    private String email;

    @JsonProperty(access = Access.WRITE_ONLY)
    @NotNull(message = "{user.field.password.not-null}")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])[0-9A-Za-z@$!%*?&]{8,16}$", message = "{user.field.password.pattern}")
    private String password;

    @JsonIgnore
    private Boolean active;

}
