package brainary.tasking;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import brainary.tasking.entities.CollaborationEntity;
import brainary.tasking.entities.IssueEntity;
import brainary.tasking.entities.IssueTypeEntity;
import brainary.tasking.entities.ProjectEntity;
import brainary.tasking.entities.StageEntity;
import brainary.tasking.entities.UserEntity;
import brainary.tasking.enumerations.IssuePriority;
import brainary.tasking.enumerations.StageType;
import brainary.tasking.repositories.CollaborationRepository;
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
    private IssueTypeRepository issueTypeRepository;

    @Autowired
    private CollaborationRepository collaborationRepository;

    @Override
    public void run(String... args) throws Exception {

        List<UserEntity> users = List.of(
            UserEntity.builder()
                .name("José Daniel Pérez Torres")
                .email("josedanielpereztorres@gmail.com")
                .password(passwordEncoder.encode("Az1234567890*"))
                .active(true)
                .build(),
            UserEntity.builder()
                .name("Ermes David Galvis Rodríguez")
                .email("galvushow@gmail.com")
                .password(passwordEncoder.encode("Az1234567890*"))
                .active(true)
                .build());
        userRepository.saveAll(users);

        for (Integer projectIndex = 1; projectIndex <= 100; projectIndex++) {

            UserEntity leader;
            UserEntity collaborator;

            if (Math.random() < 0.5) {
                leader = users.get(0);
                collaborator = users.get(1);
            } else {
                leader = users.get(1);
                collaborator = users.get(0);
            }

            ProjectEntity project = ProjectEntity.builder()
                .leader(leader)
                .name("Proyecto " + projectIndex)
                .description("Descripción " + projectIndex)
                .active(true)
                .build();
            projectRepository.save(project);

            collaborationRepository.save(CollaborationEntity.builder()
                .project(project)
                .collaborator(collaborator)
                .active(true)
                .build());

            List<IssueTypeEntity> issueTypes = List.of(
                IssueTypeEntity.builder()
                    .project(project)
                    .name("Tarea")
                    .icon("assignment_turned_in")
                    .color("#2196f3")
                    .active(true)
                    .build(),
                IssueTypeEntity.builder()
                    .project(project)
                    .name("Error")
                    .icon("report")
                    .color("#f44336")
                    .active(true)
                    .build());
            issueTypeRepository.saveAll(issueTypes);

            List<StageEntity> stages = List.of(
                StageEntity.builder()
                    .project(project)
                    .type(StageType.START)
                    .name("Por hacer")
                    .index(0)
                    .active(true)
                    .issues(new ArrayList<>())
                    .build(),
                StageEntity.builder()
                    .project(project)
                    .type(StageType.MIDDLE)
                    .name("En progreso")
                    .index(1)
                    .active(true)
                    .issues(new ArrayList<>())
                    .build(),
                StageEntity.builder()
                    .project(project)
                    .type(StageType.END)
                    .name("Listo")
                    .index(2)
                    .active(true)
                    .issues(new ArrayList<>())
                    .build());

            for (Integer issueIndex = 0; issueIndex < 5; issueIndex++) {
                StageEntity stage = stages.get((int) Math.floor(Math.random() * stages.size()));
                stage.getIssues().add(IssueEntity.builder()
                    .parent(stage.getIssues().size() == 0 ? null : stage.getIssues().get((int) Math.floor(Math.random() * stage.getIssues().size())))
                    .depth(1)
                    .type(issueTypes.get((int) Math.floor(Math.random() * issueTypes.size())))
                    .index(stage.getIssues().size())
                    .name("Tarea " + issueIndex)
                    .description("Descripción " + issueIndex)
                    .priority(IssuePriority.values()[issueIndex])
                    .complexity((int) Math.floor(Math.random() * 6))
                    .start(LocalDate.now())
                    .end(LocalDate.now())
                    .reporter(leader)
                    .assignee(users.get((int) Math.floor(Math.random() * users.size())))
                    .stage(stage)
                    .active(true)
                    .build());
            }

            stageRepository.saveAll(stages);

        }

    }

}
