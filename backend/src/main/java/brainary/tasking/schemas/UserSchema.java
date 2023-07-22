package brainary.tasking.schemas;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
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
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(value = Include.NON_NULL)
@Schema(name = "User")
public class UserSchema implements Serializable {

    private Integer id;

    @NotBlank(message = "${user.field.fullname.not-blank}")
    private String fullname;

    @NotBlank(message = "${user.field.email.not-blank}")
    @Email(message = "${user.field.email.email}")
    private String email;

    @JsonProperty(access = Access.WRITE_ONLY)
    @NotNull(message = "${user.field.password.not-null}")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&])[0-9A-Za-z@$!%*?&]{8,16}$", message = "${user.field.password.pattern}")
    private String password;

    private Boolean active;

}
