package com.wisepick.sales.exception;

public class SaleNotFoundException
        extends RuntimeException {

    public SaleNotFoundException(
            String message
    ) {

        super(message);

    }

}
