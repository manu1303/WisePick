package com.wisepick.products.exception;

public class ProductNotFoundException
        extends RuntimeException {

    public ProductNotFoundException(
            String message
    ) {
        super(message);
    }

}