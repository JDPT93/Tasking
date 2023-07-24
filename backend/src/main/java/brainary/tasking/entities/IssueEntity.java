package brainary.tasking.entities;

import java.io.Serializable;
import java.time.LocalDate;

import brainary.tasking.enumerations.IssuePriority;
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
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class IssueEntity implements Serializable {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private IssueTypeEntity type;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private IssuePriority priority;

    @Column(nullable = false)
    private Integer complexity;

    @Column(nullable = false)
    private LocalDate start;

    @Column(nullable = false)
    private LocalDate end;

    @ManyToOne
    @JoinColumn(nullable = false)
    private UserEntity reporter;

    @ManyToOne
    @JoinColumn(nullable = false)
    private UserEntity assignee;

    @ManyToOne
    @JoinColumn(nullable = false)
    private StageEntity stage;

    @Column(nullable = false)
    private Boolean active;

}