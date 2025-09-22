package com.rmgYantra.loginapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class ProjectNameAlreadyPresentException extends RuntimeException {

	public ProjectNameAlreadyPresentException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
	
	

}
