package ru.site.proj.form;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class TrainTextForm {
    @NotBlank(message = "Name must be nonempty")
    @Size(max = 20, message = "Name length must be no more than 20 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name string must contain only letters and spaces")
    private String name;

    @NotBlank
    @Size(min = 50, max = 5000, message = "Text size must be between 50 and 5000")
    @Pattern(regexp = "^[a-z\\s.,!?-]+$", message = "Text must contain only lowercase letters and punctuation")
    private String text;

    @NotBlank
    private String userLogin;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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
