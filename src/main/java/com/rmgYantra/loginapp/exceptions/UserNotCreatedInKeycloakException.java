package com.rmgYantra.loginapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
public class UserNotCreatedInKeycloakException extends RuntimeException {

    public UserNotCreatedInKeycloakException(String message) {
        super(message);
    }

}