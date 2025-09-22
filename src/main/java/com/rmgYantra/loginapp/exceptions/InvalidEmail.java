package com.rmgYantra.loginapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)
public class InvalidEmail extends RuntimeException {
	
	public InvalidEmail(String message) {
		super(message);
	}
}
