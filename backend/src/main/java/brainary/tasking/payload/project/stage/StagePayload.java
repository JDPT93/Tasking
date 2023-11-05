package brainary.tasking.payload.project.stage;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import brainary.tasking.payload.project.ProjectPayload;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "project:stage")
public class StagePayload implements Serializable {

    private Integer id;

    private ProjectPayload project;

    private TypePayload type;

    private String name;

    private Integer index;

    @JsonIgnore
    private Boolean active;

}