package com.rmgYantra.loginapp.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.model.User;
import com.rmgYantra.loginapp.repo.EmployeeRepo;

@Service
public class MyEmpDetailsService implements UserDetailsService {
	
	@Autowired
	EmployeeRepo empRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<Employee> emp = empRepo.findByUsername(username);
		emp.orElseThrow(()-> new UsernameNotFoundException("Not Found: "+ username));
		return	emp.map(MyEmpDetails::new).get();
	}

}
