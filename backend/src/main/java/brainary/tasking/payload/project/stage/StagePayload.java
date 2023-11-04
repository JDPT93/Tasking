package brainary.tasking.payload.project.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import brainary.tasking.payload.project.ProjectPayload;
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
@Schema(name = "Stage")
public class StagePayload implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{stage.field.project.not-null}")
    @JsonIgnoreProperties(value = { "stages" })
    private ProjectPayload project;

    @Valid
    @NotNull(message = "{stage.field.type.not-null}")
    private TypePayload type;

    @NotBlank(message = "{stage.field.name.not-blank}")
    private String name;

    @NotNull(message = "{stage.field.index.not-null}")
    private Integer index;

    @JsonIgnore
    private Boolean active;

}