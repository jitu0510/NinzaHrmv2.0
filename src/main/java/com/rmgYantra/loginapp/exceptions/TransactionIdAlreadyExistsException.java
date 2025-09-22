package com.rmgYantra.loginapp.exceptions;

public class TransactionIdAlreadyExistsException extends RuntimeException{
	
	public TransactionIdAlreadyExistsException(String message) {
		super(message);
	}
	
	@Override
	public String getMessage() {
		return super.getMessage();
	}

}
