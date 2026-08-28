package com.wisepick.clients.exception;


public class ClientNotFoundException
        extends RuntimeException {


    public ClientNotFoundException(
            String message
    ) {

        super(message);

    }

}
