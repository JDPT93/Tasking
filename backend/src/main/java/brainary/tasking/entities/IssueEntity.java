package brainary.tasking.entities;

import java.io.Serializable;
import java.time.LocalDate;

import org.hibernate.annotations.Where;

import brainary.tasking.enumerations.Priority;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
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
@Where(clause = "active")
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

    @Enumerated
    @Column(nullable = false)
    private Priority priority;

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