package com.app.controller;

import com.app.entity.Show;
import com.app.entity.ShowSeat;
import com.app.entity.Theater;
import com.app.services.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

// DTO classes can be top-level files if you prefer; in small projects inner classes are fine.
@RestController
@RequestMapping("/show")
public class ShowController {

    @Autowired
    private ShowService showService;

    // GET /show/getShow/{id} -> return show + seats, theater minimal info
    @GetMapping("/getShow/{id}")
    public ResponseEntity<ShowResponse> getShow(@PathVariable Integer id) {
        Optional<Show> opt = showService.getShowById(id);
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Show show = opt.get();

        // Map theater
        Theater theater = show.getTheater();
        TheaterResponse tResp = null;
        if (theater != null) {
            tResp = new TheaterResponse(theater.getId(), theater.getName(), theater.getAddress());
        }

        // Map show seats (if any). ShowSeat is assumed to have fields: id, seatNo, isAvailable
        List<ShowSeatResponse> seats = Collections.emptyList();
        if (show.getShowSeatList() != null) {
            seats = show.getShowSeatList().stream()
                    .map(s -> new ShowSeatResponse(
                            s.getId(),
                            s.getSeatNo(),
                            (s.getIsBooked() == null ? false : s.getIsBooked()) ? false : true // adapt to your field names
                    ))
                    .collect(Collectors.toList());
        }

        ShowResponse resp = new ShowResponse(
                show.getShowId(),
                show.getTime() != null ? show.getTime().toString() : null,
                show.getDate() != null ? show.getDate().toString() : null,
                tResp,
                seats
        );

        return new ResponseEntity<>(resp, HttpStatus.OK);
    }

    // --- DTO classes ---
    public static class ShowResponse {
        public Integer showId;
        public String time;
        public String date;
        public TheaterResponse theater;
        public List<ShowSeatResponse> seats;

        public ShowResponse(Integer showId, String time, String date, TheaterResponse theater, List<ShowSeatResponse> seats) {
            this.showId = showId;
            this.time = time;
            this.date = date;
            this.theater = theater;
            this.seats = seats;
        }
    }

    public static class TheaterResponse {
        public Integer id;
        public String name;
        public String address;
        public TheaterResponse(Integer id, String name, String address) {
            this.id = id;
            this.name = name;
            this.address = address;
        }
    }

    public static class ShowSeatResponse {
        public Integer id;
        public String seatNo;
        public boolean available;
        public ShowSeatResponse(Integer id, String seatNo, boolean available) {
            this.id = id;
            this.seatNo = seatNo;
            this.available = available;
        }
    }
}