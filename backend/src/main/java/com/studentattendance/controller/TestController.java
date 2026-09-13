package com.studentattendance.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Student Attendance Java Backend is running!";
    }

    @GetMapping("/test")
    public String test() {
        return "Java Spring Boot is working!";
    }
}