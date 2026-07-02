package com.movieSystem.repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.movieSystem.entity.Movie;

public interface MovieRepository extends MongoRepository< Movie, String > {
	boolean existsByNameIgnoreCase(String name);
    
}

	
	
	
	
	
	