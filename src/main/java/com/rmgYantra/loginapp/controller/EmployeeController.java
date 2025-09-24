package com.rmgYantra.loginapp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.security.RolesAllowed;

import com.rmgYantra.loginapp.repo.PayrollRepo;
import com.rmgYantra.loginapp.service.KeycloakService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rmgYantra.loginapp.exceptions.ResourceNotFoundException;
import com.rmgYantra.loginapp.exceptions.UserNameAlreadyPresentException;
import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.model.EmployeeExperience;
import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.model.User;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.repo.ProjectRepo;
import com.rmgYantra.loginapp.repo.UserRepo;
import com.rmgYantra.loginapp.service.EmployeeDAOService;
import com.rmgYantra.loginapp.service.UserService;

@RestController
@CrossOrigin(origins = {"*","http://localhost:4201"})
@Slf4j
public class EmployeeController {

	@Autowired
	private EmployeeDAOService employeeDAOService;

	@Autowired
	private EmployeeRepo employeeRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired 
	private ProjectRepo projectRepo;
	
	@Autowired
	private UserService userService;

	@Autowired
	private KeycloakService keycloakService;

	@Autowired
	private PayrollRepo payrollRepo;
	

	@PostMapping("/employees")
//	@RolesAllowed("admin")
	public ResponseEntity createEmployee(@RequestBody Employee employee) {
		log.info("POST  /employees called ");
		if (employeeRepo.findByUsername(employee.getUsername()).isPresent())
			throw new UserNameAlreadyPresentException("Username " + employee.getUsername() + " Already Exists");
		employee.setRole("user");
		Employee createdEmployee = employeeDAOService.addEmployee(employee);
		HashMap<String, String> hm = new HashMap<>();
		hm.put("employeeId", createdEmployee.getEmpId());
		hm.put("employeeName", createdEmployee.getEmpName());
		hm.put("mobile", createdEmployee.getMobileNo());
		hm.put("email", createdEmployee.getEmail());
		hm.put("dob", createdEmployee.getDob());
		hm.put("username", createdEmployee.getUsername());
		hm.put("msg", "Employee Added Successfully");

		ResponseEntity re = new ResponseEntity(hm, HttpStatus.CREATED);
		return re;
	}

	@GetMapping("/employees")
//	@RolesAllowed("admin")
	public Page<Employee> getAllEmployees(@RequestParam(required = false) String designation, Pageable pageable) {
		log.debug("GET  /employees called ");
		if (designation != null) {
			return employeeRepo.findByDesignation(designation, pageable);
		} else {
			Page<Employee> employees= employeeDAOService.findAllEmployees(pageable);
			return employees;
		}
	}
	
	@GetMapping("/all-employees")
//	@RolesAllowed("admin")
	public Page<Employee> getAllEmployeesAvailable(Pageable pageable){
		log.debug("GET  /all-employees called ");
		Page<Employee> employees =  employeeDAOService.findAllEmployees(pageable);
		return  employees;
	}
	
	@GetMapping("/count-employees")
	public Long getCountOfEmployees() {
		return employeeRepo.count();
	}

	@GetMapping("/employees/{empId}")
//	@RolesAllowed("admin")
	public Employee getEmpById(@PathVariable String empId) {
		log.info("GET  /employees/"+empId  +"called ");
		return employeeRepo.findById(empId).get();
	}

	@GetMapping("/employee/{userName}")
//	@RolesAllowed("admin")
	public Employee getEmpByUsername(@PathVariable String userName) {
		log.info("GET  /employees/"+userName  +"called ");
		return employeeRepo.findByUsername(userName)
				.orElseThrow(() -> new ResourceNotFoundException("Username Notfound"));
	}

	@PutMapping("/employees/{empId}")
//	@RolesAllowed("admin")
	public ResponseEntity<Employee> updateProject(@PathVariable String empId, @RequestBody Employee employee) {
		log.info("PUT  /employees/"+empId  +"called ");
		Employee emp = employeeRepo.findById(empId)
				.orElseThrow(() -> new ResourceNotFoundException("Project Not Found For the Id::" + empId));
		emp.setEmpId(empId);
		emp.setEmpName(employee.getEmpName());
		emp.setEmail(employee.getEmail());
		emp.setMobileNo(employee.getMobileNo());
		emp.setDob(employee.getDob());
		emp.setExperience(employee.getExperience());
		emp.setDesignation(employee.getDesignation());
		emp.setProject(employee.getProject());
		emp.setRole(employee.getRole());
		emp.setUsername(employee.getUsername());
		return ResponseEntity.ok(employeeRepo.save(emp));

	}

	@DeleteMapping("/employee/{empId}")
	public ResponseEntity deleteEmployee(@PathVariable String empId) {
		log.info("DELETE  /employees/"+empId  +"called ");
		Employee emp = employeeRepo.findByEmpId(empId);
		if(emp.getRole() != null && emp.getRole().equals("ROLE_ADMIN")) {
			HashMap<String, String> hm = new HashMap<>();
			hm.put("msg", "ADMIN Data Cannot be deleted");
			return new ResponseEntity(hm,HttpStatus.BAD_REQUEST);
		}
		if (employeeDAOService.findEmployeeById(empId)) {
			payrollRepo.deleteByEmployeeId(empId);
			employeeRepo.deleteById(empId);
			keycloakService.deleteUserFromKeycloakServer(emp.getUsername());


			//modify no of emps
			Project dbProject = projectRepo.findByProjectIdIgnoreCase(emp.getProject());
			
			dbProject.setTeamSize(dbProject.getTeamSize()-1);
			projectRepo.save(dbProject);
			HashMap<String, String> hm = new HashMap<>();
			hm.put("msg", "Employee deleted Successfully");
			return new ResponseEntity(hm, HttpStatus.NO_CONTENT);
		} else {
			throw new ResourceNotFoundException("Employee not found for the Id::" + empId);
		}
	}

	@PostMapping("/employees/resetPassword")
	public void resetPassword(@RequestBody Employee emp, @RequestParam String oldPassword,
			@RequestParam String newPassword) {

		employeeDAOService.updatePassword(emp, oldPassword,newPassword);
	}
	
	@GetMapping("/signup/{username}")
	public ResponseEntity<?> validateUserName(@PathVariable("username") String userName) {
		User user = userRepo.findByUsername(userName);
		if(user!=null) {
			return new ResponseEntity("",HttpStatus.OK);
		}
		else {
			return new ResponseEntity("",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> addUser(@RequestBody User user){
		Map responseData = new HashMap();
		try {
		  User savedUser = userService.addUser(user);
		responseData.put("user", savedUser);
		responseData.put("msg", "Data Saved Successfully !!!");
		return new ResponseEntity(responseData,HttpStatus.OK);
		}catch (Exception e) {
			responseData.put("msg", "Something Went Wrong !!!");
			return new ResponseEntity(responseData,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PutMapping("/employee/{employeeId}")
	public ResponseEntity<?> updateEmployee(@PathVariable String employeeId,@RequestBody Employee employee){
		log.info("PUT  /employee/"+employeeId  +"called ");
		Employee dbEmployee = employeeRepo.findByEmpId(employeeId);
		if(dbEmployee != null) {
			if(dbEmployee.getRole().equals("ROLE_ADMIN")) {
				Map<String, String> res = new HashMap<String, String>();
				res.put("msg", "Admin Data Cannot be Modified");
				return new ResponseEntity(res,HttpStatus.BAD_REQUEST);
			}
			dbEmployee.setEmpName(employee.getEmpName());
			dbEmployee.setEmail(employee.getEmail());
			dbEmployee.setExperience(employee.getExperience());
			dbEmployee.setMobileNo(employee.getMobileNo());
			employeeRepo.save(dbEmployee);
			return new ResponseEntity(dbEmployee,HttpStatus.OK);
		}else {
			return new ResponseEntity(dbEmployee,HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/employee/getExperiences")
	@ApiOperation(value = "Api to get employee experiences")
	public ResponseEntity<?> getEmployeesExperience(){
		log.debug("GET  /employee/getExperience called ");
		EmployeeExperience employeeExperience = employeeDAOService.getEmployeesExperience();
		if(employeeExperience != null) {
			return new ResponseEntity(employeeExperience,HttpStatus.OK);
		}else {
			return new ResponseEntity(employeeExperience,HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping(value = "/employee",produces = "application/json")
	public ResponseEntity<Object> getAllEmployeesAssociatedToProject(@RequestParam("projectId") String projectId){
		log.info("GET  /employee called ");
		List<Employee> employees= employeeRepo.findByProject(projectId);
		return new ResponseEntity(employees, HttpStatus.OK);
	}

	@PatchMapping("/employee/{id}")
	public ResponseEntity<Object> updateEmployeeUsingPatchApi(@PathVariable("id") String empId, @RequestBody Employee employee){
		log.info("PATCH  /employee/"+empId+ " called ");
		if(employee.getUsername()!= null || employee.getEmpId() != null || employee.getMobileNo() != null ||
			employee.getRole()!= null || employee.getPassword() != null){
			return new ResponseEntity("username,empId,mobileNo,role and password cannot be updated", HttpStatus.BAD_REQUEST);
		}
		Employee savedEmployee = employeeDAOService.updateEmployeeUsingPatchApi(empId,employee);
		if(savedEmployee == null)
			return new ResponseEntity("Invalid EmpId", HttpStatus.BAD_REQUEST);
		return new ResponseEntity(savedEmployee,HttpStatus.OK);
	}


}
