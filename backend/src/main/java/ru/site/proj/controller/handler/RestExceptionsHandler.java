package ru.site.proj.controller.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.site.proj.exception.BaseException;
import ru.site.proj.exception.ValidationException;

@RestControllerAdvice
public class RestExceptionsHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<String> onException(ValidationException exception){
        return new ResponseEntity<>(toError(exception), HttpStatus.BAD_REQUEST);
    }

    private String toError(ValidationException exception) {
        if (exception.getBindingResult().hasErrors()){
            return exception.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        }
        throw new RuntimeException("Unexpected Error");
    }

}