package brainary.tasking.entities.project;

import java.io.Serializable;

import brainary.tasking.entities.UserEntity;
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

@Entity(name = "project:collaboration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationEntity implements Serializable {

    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private ProjectEntity project;

    @ManyToOne
    @JoinColumn(nullable = false)
    private UserEntity collaborator;

    @Column(nullable = false)
    private Boolean active;

}
