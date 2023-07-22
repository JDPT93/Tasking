package brainary.tasking;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import brainary.tasking.entities.IssueEntity;
import brainary.tasking.entities.IssueTypeEntity;
import brainary.tasking.entities.ProjectEntity;
import brainary.tasking.entities.StageEntity;
import brainary.tasking.entities.UserEntity;
import brainary.tasking.enumerations.IssuePriority;
import brainary.tasking.enumerations.StageType;
import brainary.tasking.repositories.IssueRepository;
import brainary.tasking.repositories.IssueTypeRepository;
import brainary.tasking.repositories.ProjectRepository;
import brainary.tasking.repositories.StageRepository;
import brainary.tasking.repositories.UserRepository;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Tasking API", version = "1.0.0"))
public class TaskingApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(TaskingApplication.class, args);
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private IssueTypeRepository issueTypeRepository;

    @Override
    public void run(String... args) throws Exception {

        List<UserEntity> users = List.of(
            UserEntity.builder()
                .fullname("José Daniel Pérez Torres")
                .email("josedanielpereztorres@gmail.com")
                .password(passwordEncoder.encode("Az1234567890*"))
                .active(true)
                .build(),
            UserEntity.builder()
                .fullname("Ermes David Galvis Rodríguez")
                .email("galvushow@gmail.com")
                .password(passwordEncoder.encode("Az1234567890*"))
                .active(true)
                .build());
        userRepository.saveAll(users);

        for (Integer project = 1; project <= 100; project++) {

            UserEntity leader = users.get((int) Math.floor(Math.random() * users.size()));

            ProjectEntity projectEntity = ProjectEntity.builder()
                .leader(leader)
                .name("Proyecto " + project)
                .description("Descripción " + project)
                .active(true)
                .build();
            projectRepository.save(projectEntity);

            List<StageEntity> stages = List.of(
                StageEntity.builder()
                    .project(projectEntity)
                    .type(StageType.START)
                    .name("Por hacer")
                    .position(0)
                    .active(true)
                    .build(),
                StageEntity.builder()
                    .project(projectEntity)
                    .type(StageType.MIDDLE)
                    .name("En progreso")
                    .position(1)
                    .active(true)
                    .build(),
                StageEntity.builder()
                    .project(projectEntity)
                    .type(StageType.END)
                    .name("Listo")
                    .position(2)
                    .active(true)
                    .build());
            stageRepository.saveAll(stages);

            List<IssueTypeEntity> issueTypes = List.of(
                IssueTypeEntity.builder()
                    .project(projectEntity)
                    .name("Tarea")
                    .active(true)
                    .build(),
                IssueTypeEntity.builder()
                    .project(projectEntity)
                    .name("Error")
                    .active(true)
                    .build());
            issueTypeRepository.saveAll(issueTypes);

            for (Integer issue = 1; issue < 5; issue++) {
                issueRepository.save(IssueEntity.builder()
                    .type(issueTypes.get((int) Math.floor(Math.random() * issueTypes.size())))
                    .name("Tarea " + issue)
                    .description("Descripción " + issue)
                    .priority(IssuePriority.MEDIUM)
                    .complexity((int) Math.floor(Math.random() * 5 + 1))
                    .start(LocalDate.now())
                    .end(LocalDate.now())
                    .reporter(leader)
                    .assignee(users.get((int) Math.floor(Math.random() * users.size())))
                    .stage(stages.get((int) Math.floor(Math.random() * stages.size())))
                    .active(true)
                    .build());
            }

        }

    }

}
