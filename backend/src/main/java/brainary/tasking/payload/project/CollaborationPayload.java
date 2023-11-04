package brainary.tasking.payload.project;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.UserPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "Collaboration")
public class CollaborationPayload implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{collaboration.field.project.not-null}")
    private ProjectPayload project;

    @Valid
    @NotNull(message = "{collaboration.field.collaborator.not-null}")
    private UserPayload collaborator;

    @JsonIgnore
    private Boolean active;

}
