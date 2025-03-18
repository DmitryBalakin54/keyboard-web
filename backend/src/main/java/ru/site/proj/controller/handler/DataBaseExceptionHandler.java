package ru.site.proj.controller.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.site.proj.exception.DataBaseException;
import ru.site.proj.exception.ValidationException;

@RestControllerAdvice
public class DataBaseExceptionHandler {

    @ExceptionHandler(DataBaseException.class)
    public ResponseEntity<String> onException(DataBaseException exception){
        return new ResponseEntity<>(toError(exception), HttpStatus.BAD_REQUEST);
    }

    private String toError(DataBaseException exception) {
        return exception.getMessage();
    }

}