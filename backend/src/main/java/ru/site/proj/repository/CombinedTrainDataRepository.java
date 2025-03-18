package ru.site.proj.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.site.proj.domain.WordsList;
import ru.site.proj.dto.CombinedTrainDataDTO;

@Repository
public interface CombinedTrainDataRepository extends JpaRepository<WordsList, Long> {
    @Query(value =
            "SELECT id, name, ARRAY(SELECT jsonb_array_elements_text(words)) AS words, NULL as text, creation_time, user_id, 'WORDS_LIST' as type FROM words_list " +
            "UNION ALL " +
            "SELECT id, name, NULL as words, text, creation_time, user_id, 'TRAIN_TEXT' as type FROM train_text " +
            "ORDER BY creation_time DESC",
            countQuery =
                "SELECT COUNT(*) FROM ( " +
                "SELECT id FROM words_list " +
                "UNION ALL " +
                "SELECT id FROM train_text) AS combined",
            nativeQuery = true)
    Page<CombinedTrainDataDTO> findAllTrainData(Pageable pageable);
}
