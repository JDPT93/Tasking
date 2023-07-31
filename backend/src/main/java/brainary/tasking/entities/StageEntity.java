package brainary.tasking.entities;

import java.io.Serializable;
import java.util.List;

import brainary.tasking.enumerations.StageType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class StageEntity implements Serializable {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private ProjectEntity project;

    @Column(nullable = false)
    private StageType type;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer index;

    @Column(nullable = false)
    private Boolean active;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "stage")
    private List<IssueEntity> issues;

}