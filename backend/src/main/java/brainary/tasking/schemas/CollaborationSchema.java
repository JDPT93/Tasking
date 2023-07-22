package brainary.tasking.schemas;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
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
@Schema(name = "Collaboration")
public class CollaborationSchema implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "${collaboration.field.project.not-null}")
    private ProjectSchema project;

    @Valid
    @NotNull(message = "${collaboration.field.collaborator.not-null}")
    private UserSchema collaborator;

    @JsonProperty(access = Access.READ_ONLY)
    private Boolean active;

}
