package brainary.tasking.entity.project.stage;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "project:stage:transition")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransitionEntity implements Serializable {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private StageEntity source;

    @ManyToOne
    @JoinColumn(nullable = false)
    private StageEntity target;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Boolean active;

}