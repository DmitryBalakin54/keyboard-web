package ru.site.proj.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Service;
import ru.site.proj.domain.User;
import ru.site.proj.exception.JWTException;


@Service
public class JwtService {
    private final UserService userService;

    private static final String SECRET = "3f7a9b2e4c8d1e5f6a0b9c8d7e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f";
    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    public JwtService(UserService userService) {
        this.userService = userService;
    }

    public String createToken(User user) {
        try {
            return JWT.create()
                    .withClaim("userId", user.getId())
                    .sign(algorithm);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Cannot create jwt: " + e);
        }
    }

    public User verifyToken(String token) {
        try {
            JWTVerifier verifier = JWT.require(algorithm).build();
            return userService.findById(verifier.verify(token).getClaim("userId").asLong());
        } catch (JWTVerificationException e) {
            throw new JWTException("Cannot verify token: " + e);
        }
    }
}
