package ru.site.proj.service;

import org.springframework.stereotype.Service;
import ru.site.proj.domain.WordsList;
import ru.site.proj.repository.WordsListRepository;

import java.util.List;

@Service
public class WordsService {
    private final WordsListRepository wordsListRepository;

    public WordsService(WordsListRepository wordsListRepository) {
        this.wordsListRepository = wordsListRepository;
    }

    public List<String> getWordsById(Long id) {
        return wordsListRepository.findById(id).get().getWords();
    }

    public WordsList getWordsListById(Long id) {
        return wordsListRepository.findById(id).get();
    }

    public WordsList createWordsList(WordsList newWordsList) {
        return wordsListRepository.save(newWordsList);
    }
}
