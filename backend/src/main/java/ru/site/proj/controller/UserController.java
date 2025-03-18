package ru.site.proj.controller;

import jakarta.validation.Valid;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.site.proj.domain.User;
import ru.site.proj.exception.NotFoundEntityException;
import ru.site.proj.exception.ValidationException;
import ru.site.proj.form.UserCredentials;
import ru.site.proj.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/sign/in")
    public User createUser(@RequestBody @Valid UserCredentials userCredentials, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        User user = new User();
        user.setLogin(userCredentials.getLogin());

        return userService.save(user, userCredentials.getPassword());
    }

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        User user =  userService.findById(id);
        if (user == null) {
            throw new NotFoundEntityException("User with id=" + id.toString() + " not found");
        }

        return user;
    }
}
