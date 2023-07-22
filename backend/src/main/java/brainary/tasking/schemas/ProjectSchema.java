package brainary.tasking.schemas;

import java.io.Serializable;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
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
@Schema(name = "Project")
public class ProjectSchema implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "${project.field.leader.not-null}")
    private UserSchema leader;

    @NotBlank(message = "${project.field.name.not-blank}")
    private String name;

    @NotBlank(message = "${project.field.description.not-blank}")
    private String description;

    private Boolean active;

    @Null
    private Set<StageSchema> stages;

}
