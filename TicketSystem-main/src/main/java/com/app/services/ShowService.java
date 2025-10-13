package com.app.services;

import com.app.entity.Show;
import com.app.request.ShowRequest;
import com.app.request.ShowSeatRequest;

import java.util.Optional;

public interface ShowService {
    String saveShow(ShowRequest showRequest);
    String associateSeats(ShowSeatRequest showSeatRequest);

    /**
     * Return a show by id. Controller calls this method.
     * Using Optional keeps behavior consistent with other services.
     */
    Optional<Show> getShowById(Integer id);
}