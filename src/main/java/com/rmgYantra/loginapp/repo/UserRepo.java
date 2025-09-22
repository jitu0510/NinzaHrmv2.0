package com.rmgYantra.loginapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.User;

public interface UserRepo extends JpaRepository<User, String> {
	public User findByUsername(String userName);

}
