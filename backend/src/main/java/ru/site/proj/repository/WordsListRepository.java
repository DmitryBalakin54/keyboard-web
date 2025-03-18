package ru.site.proj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.site.proj.domain.WordsList;

import java.util.List;
import java.util.Optional;

public interface WordsListRepository extends JpaRepository<WordsList, Long> {
    Optional<WordsList> findById(Long id);
}
