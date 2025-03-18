package ru.site.proj.service;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import ru.site.proj.domain.User;
import ru.site.proj.exception.DuplicateEntryException;
import ru.site.proj.exception.UserLogInException;
import ru.site.proj.repository.UserRepository;


@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user, String password) {
        if (userRepository.findByLogin(user.getLogin()) != null) {
            throw new DuplicateEntryException("Login already exists");
        }

        User newUser = userRepository.save(user);
        if (newUser != null) {
            String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
            userRepository.updatePassword(user.getId(), passwordHash);
        }

        return newUser;
    }

    public User findByLoginAndPassword(String login, String password) {
        String truePassword = userRepository.findPasswordHashByLogin(login);
        if (truePassword == null) {
            throw new UserLogInException("Login does not exist");
        }

        if (BCrypt.checkpw(password, truePassword)) {
            return userRepository.findByLogin(login);
        }
        
        throw new UserLogInException("Incorrect password");
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findByLogin(String userLogin) {
        return userRepository.findByLogin(userLogin);
    }
}
