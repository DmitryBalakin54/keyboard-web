package ru.site.proj.exception;

import org.springframework.validation.BindingResult;

public abstract class BaseException extends RuntimeException {
    public BaseException(String message) {
        super(message);
    }

    public BaseException() {}
}
