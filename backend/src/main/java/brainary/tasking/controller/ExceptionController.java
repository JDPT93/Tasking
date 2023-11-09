package brainary.tasking.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ExceptionController {

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> exception(Exception exception) {
		return new ResponseEntity<>(Map.of("message", exception.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> responseStatusException(ResponseStatusException exception) {
		return new ResponseEntity<>(Map.of("message", exception.getReason()), exception.getStatusCode());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> methodArgumentNotValidException(MethodArgumentNotValidException exception) {
		return new ResponseEntity<>(Map.of("message", exception.getAllErrors().stream().map(ObjectError::getDefaultMessage).collect(Collectors.joining("\n\n"))), exception.getStatusCode());
	}

}
