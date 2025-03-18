package ru.site.proj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.site.proj.domain.TrainText;

public interface TrainTextRepository extends JpaRepository<TrainText, Long> {
}
