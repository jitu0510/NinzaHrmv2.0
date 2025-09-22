package com.rmgYantra.loginapp.service;

import java.util.Collections;
import java.util.List;

import com.rmgYantra.loginapp.exceptions.UserNotCreatedInKeycloakException;
import com.rmgYantra.loginapp.model.Payroll;
import com.rmgYantra.loginapp.repo.PayrollRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rmgYantra.loginapp.exceptions.InvalidEmail;
import com.rmgYantra.loginapp.exceptions.InvalidMobileNumberException;
import com.rmgYantra.loginapp.exceptions.InvalidOldPasswordException;
import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.model.EmployeeExperience;
import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.repo.ProjectRepo;

@Service
public class EmployeeDAOService {

	@Autowired
	private EmployeeRepo employeeRepo;

	@Autowired
	private ProjectRepo projectRepo;

	@Autowired
	public PasswordEncoder passwordEncoder;

	@Autowired
	private PayrollRepo payrollRepo;

/*	@Autowired
	private KeycloakService keycloakService;*/

	@Transactional
	public Employee addEmployee(Employee employee) {
		if (!employee.getMobileNo().matches("[0-9]{10}")) {
			throw new InvalidMobileNumberException("Enter a valid mobile number");
		} else if (!employee.getEmail().matches(
				"^[a-zA-Z0-9_+&*-]+(?:\\." + "[a-zA-Z0-9_+&*-]+)*@" + "(?:[a-zA-Z0-9-]+\\.)+[a-z" + "A-Z]{2,7}$")) {
			throw new InvalidEmail("Enter a valid email ID");
		}
		Employee emp = new Employee();
		emp.setDesignation(employee.getDesignation());
		emp.setEmail(employee.getEmail());
		emp.setEmpName(employee.getEmpName());
		emp.setExperience(employee.getExperience());
		emp.setMobileNo(employee.getMobileNo());
		emp.setRole(employee.getRole());
		emp.setUsername(employee.getUsername());
		emp.setDob(employee.getDob());
		String pw = employee.getUsername().substring(0, 4) + "@" + employee.getMobileNo().substring(6);
		emp.setPassword(passwordEncoder.encode(pw));
		emp.setProject(employee.getProject());

		String projectId = emp.getProject();
		Project project = projectRepo.findByProjectId(projectId);
		//System.out.println(project);
		if (project != null) {
			int currentEmployees = project.getTeamSize();
			project.setTeamSize(++currentEmployees);
			Project savedProject = projectRepo.save(project);
			//System.out.println(savedProject);
		}
		Employee savedEmp = employeeRepo.save(emp);
		//System.out.println(savedEmp.getEmpId());
		Payroll payroll = new Payroll();
		payroll.setStatus("Disabled");
		payroll.setEmployee(savedEmp);

		/*boolean isUserCreatedInKeycloak = keycloakService.createUserInKeycloakServer(employee.getUsername(), pw);
		if (isUserCreatedInKeycloak == false)
			throw new UserNotCreatedInKeycloakException("User Could Not be Created in Keycloak Server");*/
		Payroll savedPayroll = payrollRepo.save(payroll);

		return savedEmp;
	}

	public Page<Employee> findAllEmployees(Pageable pageable) {
		List<Employee> allEmployees = employeeRepo.findAll();
		// Reverse the order of the list
		Collections.reverse(allEmployees);
		// Create a sublist based on the specified Pageable
		int pageSize = pageable.getPageSize();
		int pageNumber = pageable.getPageNumber();
		int fromIndex = pageNumber * pageSize;
		int toIndex = Math.min(fromIndex + pageSize, allEmployees.size());
		List<Employee> pageContent = allEmployees.subList(fromIndex, toIndex);
		// Create a Page object with the reversed and paginated data
		return new PageImpl<>(pageContent, pageable, allEmployees.size());
	}

	public boolean findEmployeeById(String empId) {
		Employee project = employeeRepo.findById(empId).get();
		if (project != null) {
			return true;
		} else {
			return false;
		}
	}

	public void updatePassword(Employee emp, String oldPassword, String newPassword) {
		Employee employee = employeeRepo.findById(emp.getEmpId()).get();

		if (passwordEncoder.matches(oldPassword, employee.getPassword())) {
			employee.setPassword(passwordEncoder.encode(newPassword));
			employeeRepo.save(employee);
		} else {
			throw new InvalidOldPasswordException("Invalid old password");
		}
	}

	public EmployeeExperience getEmployeesExperience() {
		List<Employee> employees = (List<Employee>) employeeRepo.findAll();
		EmployeeExperience employeeExperience = new EmployeeExperience();

		for (Employee emp : employees) {
			double exp = emp.getExperience();
			if (exp >= 0 && exp <= 5) {
				employeeExperience.setZeroToFive(employeeExperience.getZeroToFive() + 1);
			} else if (exp >= 5 && exp <= 10) {
				employeeExperience.setSixToTen(employeeExperience.getSixToTen() + 1);
			} else if (exp >= 11 && exp <= 15) {
				employeeExperience.setElevenToFifteen(employeeExperience.getElevenToFifteen() + 1);
			} else if (exp >= 16 && exp <= 20) {
				employeeExperience.setSixteenToTwenty(employeeExperience.getSixteenToTwenty() + 1);
			} else {
				employeeExperience.setGreaterThanTwenty(employeeExperience.getGreaterThanTwenty() + 1);
			}
		}
		return employeeExperience;
	}

	public Employee updateEmployeeUsingPatchApi(String employeeId, Employee employee){
		Employee dbEmployee = employeeRepo.findByEmpId(employeeId);
		if(dbEmployee == null){
			return  null;
		}
		if(employee.getDesignation() != null)
			dbEmployee.setDesignation(employee.getDesignation());
		if(employee.getDob() != null)
			dbEmployee.setDob(employee.getDob());
		if(employee.getEmail() != null)
			dbEmployee.setEmail(employee.getEmail());
		if(employee.getEmpName() != null)
			dbEmployee.setEmpName(employee.getEmpName());
		if(employee.getExperience() != 0.0)
			dbEmployee.setExperience(employee.getExperience());

		Employee savedEmployee = employeeRepo.save(dbEmployee);
		return savedEmployee;
	}
}