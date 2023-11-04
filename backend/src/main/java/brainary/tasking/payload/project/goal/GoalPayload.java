package brainary.tasking.payload.project.goal;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(name = "Goal")
public class GoalPayload implements Serializable {

    private Integer id;

    @NotBlank(message = "{goal.field.type.not-blank}")
    private TypePayload type;

    @NotNull(message = "{goal.field.index.not-null}")
    private Integer index;

    @NotBlank(message = "{goal.field.name.not-blank}")
    private String name;

    @NotBlank(message = "{goal.field.description.not-blank}")
    private String description;

    @JsonIgnore
    private Boolean active;

}