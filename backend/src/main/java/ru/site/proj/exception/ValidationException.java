package ru.site.proj.exception;

import org.springframework.validation.BindingResult;

public class ValidationException extends BaseException {

    private final BindingResult bindingResult;

    public BindingResult getBindingResult() {
        return bindingResult;
    }

    public ValidationException(BindingResult bindingResult) {
        super();
        this.bindingResult = bindingResult;
    }
}
