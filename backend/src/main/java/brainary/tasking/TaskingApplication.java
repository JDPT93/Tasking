package brainary.tasking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private brainary.tasking.repository.UserRepository userRepository;

    @Autowired
    private brainary.tasking.repository.project.ProjectRepository projectRepository;

    @Autowired
    private brainary.tasking.repository.project.CollaborationRepository collaborationRepository;

    @Autowired
    private brainary.tasking.repository.project.stage.TypeRepository stageTypeRepository;

    @Autowired
    private brainary.tasking.repository.project.stage.StageRepository stageRepository;

    @Autowired
    private brainary.tasking.repository.project.goal.TypeRepository goalTypeRepository;

    @Autowired
    private brainary.tasking.repository.project.goal.PriorityRepository priorityRepository;

    private <T> List<T> loadJson(Class<T> type, String path) throws Exception {
        MappingIterator<T> mappingIterator = new ObjectMapper().readerFor(type).readValues(new ClassPathResource(path).getFile());
        return mappingIterator.readAll();
    }

    @Override
    public void run(String... args) throws Exception {
        userRepository.saveAll(loadJson(brainary.tasking.entities.UserEntity.class, "data/users.json").stream().map(userEntity -> {
            userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
            return userEntity;
        }).toList());

        projectRepository.saveAll(loadJson(brainary.tasking.entities.project.ProjectEntity.class, "data/project/projects.json"));
        collaborationRepository.saveAll(loadJson(brainary.tasking.entities.project.CollaborationEntity.class, "data/project/collaborations.json"));

        stageTypeRepository.saveAll(loadJson(brainary.tasking.entities.project.stage.TypeEntity.class, "data/project/stage/types.json"));
        stageRepository.saveAll(loadJson(brainary.tasking.entities.project.stage.StageEntity.class, "data/project/stage/stages.json"));

        goalTypeRepository.saveAll(loadJson(brainary.tasking.entities.project.goal.TypeEntity.class, "data/project/goal/types.json"));
        priorityRepository.saveAll(loadJson(brainary.tasking.entities.project.goal.PriorityEntity.class, "data/project/goal/priorities.json"));
    }

}
