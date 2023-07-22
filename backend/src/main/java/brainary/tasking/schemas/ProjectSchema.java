package brainary.tasking.schemas;

import java.io.Serializable;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @JsonProperty(access = Access.READ_ONLY)
    private Boolean active;

    @JsonProperty(access = Access.READ_ONLY)
    private Set<StageSchema> stages;

}
