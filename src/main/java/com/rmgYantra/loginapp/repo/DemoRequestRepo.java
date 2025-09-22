package com.rmgYantra.loginapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.DemoRequest;

public interface DemoRequestRepo extends JpaRepository<DemoRequest, String>{

}
