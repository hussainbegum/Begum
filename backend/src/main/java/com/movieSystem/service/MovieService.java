package com.movieSystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.movieSystem.entity.Movie;
import com.movieSystem.repository.MovieRepository;

@Service
public class MovieService {
  @Autowired
	    private MovieRepository repository;

	    // ✅ READ
	    public List<Movie> getAllMovies() {
	        return repository.findAll();
	    }

	    // ✅ CREATE
	    public Movie saveMovie(Movie movie) {

	        if (repository.existsByNameIgnoreCase(movie.getName())) {
	            throw new RuntimeException("Movie already exists with name: " + movie.getName());
	        }
	        
   return repository.save(movie);
	    }
	  
 public void deleteMovie(String id) {

		    if (!repository.existsById(id)) {
		        throw new RuntimeException("Movie not found with id: " + id);
		    }

		    repository.deleteById(id);
		}
	
 // ✅ UPDATE
	  public Movie updateMovie(String id, Movie movie) {
		    return repository.findById(id).map(existingMovie -> {
		        existingMovie.setName(movie.getName());
		        existingMovie.setReview(movie.getReview());
		        existingMovie.setRating(movie.getRating());
		        
		        // ADD THIS LINE:
		        existingMovie.setImage(movie.getImage()); 

		        return repository.save(existingMovie);
		    }).orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
		}
	}
