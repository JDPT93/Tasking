package brainary.tasking.payload.project.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Schema(name = "Transition")
public class TransitionPayload implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{transition.field.source.not-null}")
    private StagePayload source;

    @Valid
    @NotNull(message = "{transition.field.target.not-null}")
    private StagePayload target;

    @NotBlank(message = "{transition.field.name.not-blank}")
    private String name;

    @JsonIgnore
    private Boolean active;

}