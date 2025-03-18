package ru.site.proj.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.site.proj.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Transactional
    @Modifying
    @Query(value = "UPDATE users SET password=?2 WHERE id=?1", nativeQuery = true)
    void updatePassword(Long id, String password);


    Optional<User> findById(Long id);

    @Query(value = "SELECT password FROM users WHERE login=?1", nativeQuery = true)
    String findPasswordHashByLogin(String login);

    User findByLogin(String login);
}
