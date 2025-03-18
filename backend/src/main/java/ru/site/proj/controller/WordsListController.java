package ru.site.proj.controller;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.site.proj.Utils.WordsRandomSorting;
import ru.site.proj.domain.User;
import ru.site.proj.domain.WordsList;
import ru.site.proj.exception.NotFoundEntityException;
import ru.site.proj.exception.UserLogInException;
import ru.site.proj.exception.ValidationException;
import ru.site.proj.form.WordsForm;
import ru.site.proj.service.UserService;
import ru.site.proj.service.WordsService;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class WordsListController {
    private final WordsService wordsService;
    private final UserService userService;

    public WordsListController(WordsService wordsService, UserService userService) {
        this.wordsService = wordsService;
        this.userService = userService;
    }

    @GetMapping("/train/default/en")
    public List<String> getDefaultEnWords() {
        return WordsRandomSorting.getWordsMaximumLenRandomisedList(wordsService.getWordsById(1L));
    }

    @GetMapping("/words/get/{id}")
    public List<String> getWordsListById(@PathVariable Long id) {
        List<String> words = wordsService.getWordsById(id);
        if (words == null || words.isEmpty()) {
            throw new NotFoundEntityException("Can't find words by id: " + id);
        }

        return WordsRandomSorting.getWordsMaximumLenRandomisedList(words);
    }

    @PostMapping("/create/words")
    public List<String> createWords(@RequestBody @Valid WordsForm wordsForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        User user = userService.findByLogin(wordsForm.getUserLogin());
        if (user == null) {
            throw new UserLogInException("Login does not exist");
        }

        WordsList newWordsList = new WordsList();
        newWordsList.setName(wordsForm.getName());
        newWordsList.setUser(user);
        newWordsList.setWords(Arrays.stream(wordsForm.getWords().trim().split("\\s+")).toList());
        return wordsService.createWordsList(newWordsList).getWords();
    }
}
