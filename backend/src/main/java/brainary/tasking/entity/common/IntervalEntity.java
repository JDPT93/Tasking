package brainary.tasking.entity.common;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IntervalEntity<T> implements Serializable {

    @Column(nullable = false)
    private T from;

    @Column(nullable = false)
    private T to;

}
