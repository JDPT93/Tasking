package brainary.tasking.schemas;

import java.io.Serializable;

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
@Schema(name = "IssueType")
public class IssueTypeSchema implements Serializable {

    private Integer id;

    @Valid
    @NotNull(message = "${issue-type.field.project.not-null}")
    private ProjectSchema project;

    @NotBlank(message = "${issue-type.field.name.not-blank}")
    private String name;

    @JsonProperty(access = Access.READ_ONLY)
    private Boolean active;

}