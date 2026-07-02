package com.movieSystem.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.movieSystem.entity.Booking;

public interface BookingRepository extends MongoRepository<Booking, String> {

}
