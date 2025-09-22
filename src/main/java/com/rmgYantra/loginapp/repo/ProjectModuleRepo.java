package com.rmgYantra.loginapp.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.ProjectModule;

public interface ProjectModuleRepo extends JpaRepository<ProjectModule, String>{
	
	public Optional<ProjectModule> findByModuleName(String moduleName);

}
