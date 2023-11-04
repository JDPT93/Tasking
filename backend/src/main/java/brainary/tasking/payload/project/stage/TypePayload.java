package brainary.tasking.payload.project.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Type")
public class TypePayload implements Serializable {

    private Integer id;

    @NotBlank(message = "{type.field.name.not-blank}")
    private String name;

    @JsonIgnore
    private Boolean active;

}