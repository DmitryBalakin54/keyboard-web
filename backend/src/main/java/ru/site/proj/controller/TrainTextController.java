package ru.site.proj.controller;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.site.proj.domain.TrainText;
import ru.site.proj.domain.User;
import ru.site.proj.dto.CombineTrainData;
import ru.site.proj.dto.CombinedTrainDataDTO;
import ru.site.proj.exception.NotFoundEntityException;
import ru.site.proj.exception.UserLogInException;
import ru.site.proj.exception.ValidationException;
import ru.site.proj.form.TrainTextForm;
import ru.site.proj.service.TrainTextService;
import ru.site.proj.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TrainTextController {
    private final UserService userService;
    private final TrainTextService trainTextService;

    public TrainTextController(UserService userService, TrainTextService trainTextService) {
        this.userService = userService;
        this.trainTextService = trainTextService;
    }

    @GetMapping("/text/get/{id}")
    public String getText(@PathVariable Long id) {
        String text = trainTextService.getTextById(id);
        if (text == null) {
            throw new NotFoundEntityException("TrainText with id " + id + " not found");
        }

        return text;
    }

    @GetMapping("/text/get/item/{id}")
    public CombinedTrainDataDTO getTrainText(@PathVariable Long id) {
        TrainText text = trainTextService.getTrainTextById(id);
        if (text == null) {
            throw new NotFoundEntityException("TrainText with id " + id + " not found");
        }

        return new CombineTrainData(text);
    }

    @PostMapping("/create/text")
    public String createText(@RequestBody @Valid TrainTextForm textForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        User user = userService.findByLogin(textForm.getUserLogin());
        if (user == null) {
            throw new UserLogInException("Login does not exist");
        }

        TrainText trainText = new TrainText();
        trainText.setName(textForm.getName());
        trainText.setText(textForm.getText());
        trainText.setUser(user);
        return trainTextService.createTrainText(trainText).getText();
    }
}
