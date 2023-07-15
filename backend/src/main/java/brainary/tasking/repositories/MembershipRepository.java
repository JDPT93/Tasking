package brainary.tasking.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import brainary.tasking.entities.MembershipEntity;

public interface MembershipRepository extends JpaRepository<MembershipEntity, Integer> {

}
