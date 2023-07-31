package brainary.tasking.schemas;

import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import brainary.tasking.enumerations.IssuePriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
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
@Schema(name = "Issue")
public class IssueSchema implements Serializable {

    private Integer id;

    @Valid
    private IssueSchema parent;

    @NotNull(message = "{issue.field.depth.not-null}")
    private Integer depth;

    @Valid
    @NotNull(message = "{issue.field.type.not-null}")
    @JsonIgnoreProperties(value = { "project" })
    private IssueTypeSchema type;

    @NotNull(message = "{issue.field.index.not-null}")
    private Integer index;

    @NotBlank(message = "{issue.field.name.not-blank}")
    private String name;

    @NotBlank(message = "{issue.field.description.not-blank}")
    private String description;

    @NotNull(message = "{issue.field.priority.not-null}")
    private IssuePriority priority;

    @NotNull(message = "{issue.field.complexity.not-null}")
    private Integer complexity;

    @NotNull(message = "{issue.field.start.not-null}")
    @FutureOrPresent(message = "{issue.field.end.future-or-present}")
    private LocalDate start;

    @NotNull(message = "{issue.field.end.not-null}")
    @Future(message = "{issue.field.end.future}")
    private LocalDate end;

    @Valid
    @NotNull(message = "{issue.field.reporter.not-null}")
    private UserSchema reporter;

    @Valid
    @NotNull(message = "{issue.field.assignee.not-null}")
    private UserSchema assignee;

    @Valid
    @NotNull(message = "{issue.field.stage.not-null}")
    @JsonIgnoreProperties(value = { "issues" })
    private StageSchema stage;

    @JsonProperty(access = Access.READ_ONLY)
    private Boolean active;

}