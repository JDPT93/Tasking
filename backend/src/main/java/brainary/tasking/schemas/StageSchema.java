package brainary.tasking.schemas;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import brainary.tasking.enumerations.StageType;
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
@Schema(name = "Stage")
public class StageSchema implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{stage.field.project.not-null}")
    @JsonIgnoreProperties(value = { "stages" })
    private ProjectSchema project;

    @Valid
    @NotNull(message = "{stage.field.type.not-null}")
    private StageType type;

    @NotBlank(message = "{stage.field.name.not-blank}")
    private String name;

    @NotNull(message = "{stage.field.index.not-null}")
    private Integer index;

    @JsonProperty(access = Access.READ_ONLY)
    private Boolean active;

    @JsonIgnoreProperties(value = { "stage" })
    @JsonProperty(access = Access.READ_ONLY)
    private List<IssueSchema> issues;

}