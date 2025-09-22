package com.rmgYantra.loginapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class ProjectNotDeletableException extends RuntimeException {

	public ProjectNotDeletableException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
	
	

}
