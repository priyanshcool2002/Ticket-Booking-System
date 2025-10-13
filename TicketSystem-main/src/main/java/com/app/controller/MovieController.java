package com.app.controller;

import com.app.entity.Movie;
import com.app.exceptions.MovieDoesNotExists;
import com.app.request.MovieRequest;
import com.app.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/movie")
public class MovieController {

	@Autowired
	private MovieService movieService;

	// ----------------------------------------
	// 1. Add a new movie (Admin)
	// ----------------------------------------
	@PostMapping("/addNew")
	public ResponseEntity<String> addNewMovie(@RequestBody MovieRequest movieRequest) {
		try {
			String result = movieService.saveMovie(movieRequest);
			return new ResponseEntity<>(result, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	// ----------------------------------------
	// 2. Delete a movie by ID (Admin)
	// ----------------------------------------
	@DeleteMapping("/deleteMovie/{id}")
	public ResponseEntity<String> deleteMovie(@PathVariable Integer id) {
		try {
			String result = movieService.removeMovie(id);
			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	// ----------------------------------------
	// 3. Update an existing movie (Admin)
	// ----------------------------------------
	@PutMapping("/updateMovie/{id}")
	public ResponseEntity<String> updateMovie(@RequestBody MovieRequest movieRequest, @PathVariable("id") Integer id) {
		try {
			String result = movieService.updateMovie(id, movieRequest);
			return new ResponseEntity<>(result, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	// ----------------------------------------
	// 4. Get list of all movies
	// ----------------------------------------
	@GetMapping("/getMovies")
	public ResponseEntity<List<Movie>> getAllMovies() {
		List<Movie> movies = movieService.getMovies();
		return new ResponseEntity<>(movies, HttpStatus.OK);
	}

	// ----------------------------------------
	// 5. Get a specific movie by ID
	// ----------------------------------------
	@GetMapping("/getMovies/{id}")
	public ResponseEntity<Movie> getMovieById(@PathVariable int id) {
		Optional<Movie> movie = movieService.getMovieById(id);
		if (movie.isPresent()) {
			return new ResponseEntity<>(movie.get(), HttpStatus.OK);
		} else {
			throw new MovieDoesNotExists();
		}
	}
}