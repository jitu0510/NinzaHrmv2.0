package com.rmgYantra.loginapp.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rmgYantra.loginapp.model.Employee;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, String>{
	public Employee findByEmpName(String empName);
	public Employee findByEmpId(String empId);
	Optional<Employee> findByUsername(String username);
	public Page<Employee> findByDesignation(String designation,Pageable pageable);
	public Employee findByEmail(String email);
	public List<Employee> findByProject(String project);
}