package brainary.tasking.entity.project.stage;

import java.io.Serializable;

import brainary.tasking.entity.project.ProjectEntity;
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

@Entity(name = "project:stage")
@Getter
@Setter
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

	@ManyToOne
	@JoinColumn(nullable = false)
	private TypeEntity type;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private Integer index;

	@Column(nullable = false)
	private Boolean active;

}