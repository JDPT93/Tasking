package brainary.tasking.payload.project.goal;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Schema(name = "IssueType")
public class TypePayload implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "{issue-type.field.project.not-null}")
    private ProjectPayload project;

    @NotBlank(message = "{issue-type.field.name.not-blank}")
    private String name;

    @NotBlank(message = "{issue-type.field.icon.not-blank}")
    private String icon;

    @NotNull(message = "{issue-type.field.color.not-null}")
    private Integer color;

    @JsonIgnore
    private Boolean active;

}