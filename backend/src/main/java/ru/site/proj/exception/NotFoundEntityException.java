package ru.site.proj.exception;

public class NotFoundEntityException extends DataBaseException {

    public NotFoundEntityException(String message) {
        super(message);
    }
}
