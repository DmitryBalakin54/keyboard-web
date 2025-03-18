package ru.site.proj.exception;

public class DuplicateEntryException extends DataBaseException {
    public DuplicateEntryException(String message) {
        super(message);
    }
}
