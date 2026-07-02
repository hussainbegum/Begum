package com.movieSystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.movieSystem.entity.Booking;
import com.movieSystem.service.BookingService;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService service;

    @PostMapping("/save")
    public Booking saveBooking(
            @RequestBody Booking booking) {

        return service.saveBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return service.getAllBookings();
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(
            @PathVariable String id) {

        service.deleteBooking(id);
    }
}