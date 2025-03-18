package ru.site.proj.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.site.proj.dto.CombinedTrainDataDTO;
import ru.site.proj.repository.CombinedTrainDataRepository;

@Service
public class CombinedTrainDataService {
    private final CombinedTrainDataRepository combinedTrainDataRepository;

    public CombinedTrainDataService(CombinedTrainDataRepository combinedTrainDataRepository) {
        this.combinedTrainDataRepository = combinedTrainDataRepository;
    }

    public Page<CombinedTrainDataDTO> getCombinedTrainData(Pageable pageable) {
        return combinedTrainDataRepository.findAllTrainData(pageable);
    }
}
