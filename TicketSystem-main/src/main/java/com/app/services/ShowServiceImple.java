package com.app.services;

import com.app.convertor.ShowConvertor;
import com.app.entity.*;
import com.app.enums.SeatType;
import com.app.exceptions.MovieDoesNotExists;
import com.app.exceptions.ShowDoesNotExists;
import com.app.exceptions.TheaterDoesNotExists;
import com.app.repository.MovieRepository;
import com.app.repository.ShowRepository;
import com.app.repository.TheaterRepository;
import com.app.request.ShowRequest;
import com.app.request.ShowSeatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ShowServiceImple implements ShowService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Autowired
    private ShowRepository showRepository;

    @Override
    public String saveShow(ShowRequest showRequest) {
        // Convert DTO -> entity
        Show show = ShowConvertor.showDtroToShow(showRequest);

        // find movie
        Movie movie = movieRepository.findById(showRequest.getMovieId())
                .orElseThrow(MovieDoesNotExists::new);

        // find theater
        Theater theater = theaterRepository.findById(showRequest.getTheaterId())
                .orElseThrow(TheaterDoesNotExists::new);

        // set relationships
        show.setMovie(movie);
        show.setTheater(theater);

        // Save the show (will get id)
        Show savedShow = showRepository.save(show);

        // Maintain bidirectional collections
        if (movie.getShows() == null) {
            movie.setShows(new java.util.ArrayList<>());
        }
        movie.getShows().add(savedShow);

        if (theater.getShowList() == null) {
            theater.setShowList(new java.util.ArrayList<>());
        }
        theater.getShowList().add(savedShow);

        // Persist parents (optional but keeps in-sync)
        movieRepository.save(movie);
        theaterRepository.save(theater);

        return "Show has been added successfully";
    }

    @Override
    public String associateSeats(ShowSeatRequest showSeatRequest) {
        Show show = showRepository.findById(showSeatRequest.getShowId())
                .orElseThrow(ShowDoesNotExists::new);

        Theater theater = show.getTheater();
        if (theater == null) {
            throw new TheaterDoesNotExists();
        }

        List<TheaterSeat> theaterSeatsList = theater.getTheaterSeatList();
        if (theaterSeatsList == null || theaterSeatsList.isEmpty()) {
            // nothing to associate
            return "No theater seats to associate";
        }

        // ensure show seat list initialized
        if (show.getShowSeatList() == null) {
            show.setShowSeatList(new java.util.ArrayList<>());
        }

        for (TheaterSeat theaterSeat : theaterSeatsList) {
            ShowSeat showSeat = new ShowSeat();

            showSeat.setSeatNo(theaterSeat.getSeatNo());
            showSeat.setSeatType(theaterSeat.getSeatType());

            if (SeatType.CLASSIC.equals(showSeat.getSeatType())) {
                showSeat.setPrice(showSeatRequest.getPriceOfClassicSeat());
            } else {
                showSeat.setPrice(showSeatRequest.getPriceOfPremiumSeat());
            }

            showSeat.setShow(show);
            showSeat.setIsAvailable(Boolean.TRUE);
            showSeat.setIsFoodContains(Boolean.FALSE);

            show.getShowSeatList().add(showSeat);
        }

        // saving show cascades to show seats (because of CascadeType.ALL on Show->ShowSeat)
        showRepository.save(show);

        return "Show seats have been associated successfully";
    }

    @Override
    public Optional<Show> getShowById(Integer id) {
        return showRepository.findById(id);
    }
}