package com.app.repository;

import com.app.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShowRepository extends JpaRepository<Show, Integer> {

    // fetch show with theater and show seats (adjust seats fetch if you don't want them)
    @Query("select s from Show s " +
            "left join fetch s.theater t " +
            "left join fetch s.showSeatList ss " +
            "where s.showId = :id")
    Optional<Show> findByIdWithTheaterAndSeats(@Param("id") Integer id);
}