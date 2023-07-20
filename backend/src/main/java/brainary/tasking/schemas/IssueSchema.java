package brainary.tasking.schemas;

import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import brainary.tasking.enumerations.Priority;
import io.swagger.v3.oas.annotations.media.Schema;
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

    private IssueTypeSchema type;

    private String name;

    private String description;

    private Priority priority;

    private Integer complexity;

    private LocalDate start;

    private LocalDate end;

    private UserSchema reporter;

    private UserSchema assignee;

    private StageSchema stage;

    private Boolean active;

}