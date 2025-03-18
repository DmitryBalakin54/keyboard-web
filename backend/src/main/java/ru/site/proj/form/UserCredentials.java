package ru.site.proj.form;


import jakarta.validation.constraints.*;

public class UserCredentials {

    @NotBlank(message = "Login must be not blank")
    @Size(min = 6, max = 16, message = "Login size must be between 6 and 16")
    @Pattern(regexp = "^[A-Za-z\\d]+$", message = "Login must contain only English letters and digits")
    public String login;

    @NotBlank(message = "Password must be not blank")
    @Size(min = 10, max = 25, message = "Password size must be between 10 and 25")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{10,25}$",
            message = "Password must contain at least one uppercase letter, " +
                    "one lowercase letter, " +
                    "one digit, " +
                    "and one special character"
    )
    public String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
