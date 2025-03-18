package ru.site.proj.controller;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.site.proj.domain.User;
import ru.site.proj.exception.ValidationException;
import ru.site.proj.form.UserCredentials;
import ru.site.proj.service.JwtService;
import ru.site.proj.service.UserService;

@RestController
@RequestMapping("/api")
public class JwtController {
    private final JwtService jwtService;
    private final UserService userService;

    public JwtController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/jwt/create")
    public String createJwt(@RequestBody @Valid UserCredentials userCredentials, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        User user = userService.findByLoginAndPassword(userCredentials.getLogin(), userCredentials.getPassword());
        return jwtService.createToken(user);
    }

    @GetMapping("/jwt/find")
    public User find(@RequestParam String jwt) {
        return jwtService.verifyToken(jwt);
    }
}
