package brainary.tasking.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Boolean existsByEmail(String email);

    Optional<UserEntity> findByEmail(String email);

}
