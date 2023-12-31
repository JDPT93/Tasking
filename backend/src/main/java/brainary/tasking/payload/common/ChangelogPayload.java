package brainary.tasking.payload.common;

import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "common.changelog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangelogPayload<T> implements Serializable {

	private T before;

	private T after;

}
