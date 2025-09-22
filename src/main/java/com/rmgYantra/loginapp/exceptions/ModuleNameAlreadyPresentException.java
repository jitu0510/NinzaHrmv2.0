package com.rmgYantra.loginapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class ModuleNameAlreadyPresentException extends RuntimeException {

	public ModuleNameAlreadyPresentException(String message) {
		super(message);
		
	}
	
	

}
