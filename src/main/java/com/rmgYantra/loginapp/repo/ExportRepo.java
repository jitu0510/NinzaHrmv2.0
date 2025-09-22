package com.rmgYantra.loginapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.Project;

public interface ExportRepo extends JpaRepository<Project, String> {

}
