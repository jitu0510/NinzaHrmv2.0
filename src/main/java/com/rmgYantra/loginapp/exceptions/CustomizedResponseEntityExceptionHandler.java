package com.rmgYantra.loginapp.exceptions;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.Date;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@ControllerAdvice
public class CustomizedResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	@ExceptionHandler(UserNameAlreadyPresentException.class)
	protected ResponseEntity<Object> handleUserNameAlreadyPresentException(UserNameAlreadyPresentException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ProjectNameAlreadyPresentException.class)
	protected ResponseEntity<Object> handleProjectNameAlreadyPresentException(ProjectNameAlreadyPresentException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.CONFLICT);
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	protected ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(TransactionIdAlreadyExistsException.class)
	protected ResponseEntity<Object> handleTransactionIdAlreadyExistsException(TransactionIdAlreadyExistsException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(HttpClientErrorException.class)
	protected ResponseEntity<Object> handleHttpClientErrorException(HttpClientErrorException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getStatusText(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, ex.getStatusCode());
	}

	@ExceptionHandler(HttpServerErrorException.class)
	protected ResponseEntity<Object> handleHttpServerErrorException(HttpServerErrorException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getStatusText(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, ex.getStatusCode());
	}
	@ExceptionHandler(SQLIntegrityConstraintViolationException.class)
	public ResponseEntity<Object> handleAllExceptions(SQLIntegrityConstraintViolationException ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(InvalidRequestBodyException.class)
	public ResponseEntity<Object> handleInvalidRequestBodyException(InvalidRequestBodyException ex, WebRequest request){
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), request.getDescription(false));
		return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	}



	@Override
	public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
		StringBuilder errors = new StringBuilder();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			errors.append(error.getField()).append(": ").append(error.getDefaultMessage()).append(", ");
		}
		ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), "Validation Failed", errors.toString());
		return new ResponseEntity<>(exceptionResponse, HttpStatus.BAD_REQUEST);
	}

}
