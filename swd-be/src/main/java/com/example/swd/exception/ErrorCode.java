package com.example.swd.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORY_EXCEPTION(9999, "Uncategory exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "INVALID_KEY", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already existed", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "Password must at least 8 characters", HttpStatus.BAD_REQUEST),
    NOT_FOUND(1004, "Not Found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1005, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1006, "You do not have permission", HttpStatus.FORBIDDEN),
    CATEGORY_EXISTED(1007, "Category already existed", HttpStatus.BAD_REQUEST),
    ;
    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
    }
}
