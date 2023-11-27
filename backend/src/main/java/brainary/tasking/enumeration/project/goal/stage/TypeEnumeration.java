package brainary.tasking.enumeration.project.goal.stage;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TypeEnumeration {

	ToDo(1), InProgress(2), Done(3);

	private Integer id;

}
