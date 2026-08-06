package com.wisepick.company.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/company")
public class HealthController {


    @GetMapping("/health")
    public String health() {

        return "WisePick Company Service is running";

    }

}