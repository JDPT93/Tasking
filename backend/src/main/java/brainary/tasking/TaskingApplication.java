package brainary.tasking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import brainary.tasking.entities.ProjectEntity;
import brainary.tasking.entities.UserEntity;
import brainary.tasking.repositories.ProjectRepository;
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

    @Override
    public void run(String... args) throws Exception {

        UserEntity userEntity1 = UserEntity.builder()
            .name("José Daniel")
            .surname("Pérez Torres")
            .email("josedanielpereztorres@gmail.com")
            .password(passwordEncoder.encode("1234567890"))
            .active(true)
            .build();
        userRepository.save(userEntity1);

        UserEntity userEntity2 = UserEntity.builder()
            .name("Ermes David")
            .surname("Galvis Rodríguez") 
            .email("galvushow@gmail.com")
            .password(passwordEncoder.encode("1234567890"))
            .active(true)
            .build();
        userRepository.save(userEntity2);

        for (Integer index = 1; index <= 100; index++) {
            ProjectEntity projectEntity = ProjectEntity.builder()
                .leader(index % 2 == 0 ? userEntity1 : userEntity2)
                .name("Test " + index)
                .description("Test Project " + index)
                .active(true)
                .build();
            projectRepository.save(projectEntity);
        }

    }

}
