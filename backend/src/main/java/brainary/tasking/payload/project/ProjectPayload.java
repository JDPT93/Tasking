package brainary.tasking.payload.project;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.UserPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Project")
public class ProjectPayload implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{project.field.leader.not-null}")
    private UserPayload leader;

    @NotBlank(message = "{project.field.name.not-blank}")
    private String name;

    @NotBlank(message = "{project.field.description.not-blank}")
    private String description;

    @JsonIgnore
    private Boolean active;

}
