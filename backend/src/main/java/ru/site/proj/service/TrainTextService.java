package ru.site.proj.service;

import org.springframework.stereotype.Service;
import ru.site.proj.domain.TrainText;
import ru.site.proj.repository.TrainTextRepository;

@Service
public class TrainTextService {

    private final TrainTextRepository trainTextRepository;

    public TrainTextService(TrainTextRepository trainTextRepository) {
        this.trainTextRepository = trainTextRepository;
    }

    public TrainText createTrainText(TrainText trainText) {
        return trainTextRepository.save(trainText);
    }

    public String getTextById(Long id) {
        TrainText text = trainTextRepository.findById(id).orElse(null);
        if (text == null) {
            return null;
        }

        return text.getText();
    }
}
