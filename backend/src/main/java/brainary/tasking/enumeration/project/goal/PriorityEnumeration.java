package brainary.tasking.enumeration.project.goal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PriorityEnumeration {

	Higher(1), High(2), Medium(3), Low(4), Lower(5);

	private Integer id;

}
