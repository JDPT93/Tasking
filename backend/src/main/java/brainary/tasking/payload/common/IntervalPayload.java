package brainary.tasking.payload.common;

import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(name = "common.interval")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IntervalPayload<T> implements Serializable {

	private T from;

	private T to;

}
