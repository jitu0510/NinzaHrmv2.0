package com.rmgYantra.loginapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.Feedback;

public interface FeedbackRepo extends JpaRepository<Feedback, String>{

}
