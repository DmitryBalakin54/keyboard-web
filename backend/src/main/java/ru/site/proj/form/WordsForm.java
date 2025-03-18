package ru.site.proj.form;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class WordsForm {
    @NotBlank(message = "Name must be nonempty")
    @Size(max = 20, message = "Name length must be no more than 20 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name string must contain only letters and spaces")
    private String name;

    @NotBlank(message = "Words string must be nonempty")
    @Size(max = 5000, message = "Words string length must be no more than 5000 characters")
    @Pattern(regexp = "^[a-z\\s]+$", message = "Words string must contain only lowercase letters and spaces")
    private String words;

    @NotBlank
    private String userLogin;

    public String getWords() {
        return words;
    }

    public void setWords(String words) {
        this.words = words;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
