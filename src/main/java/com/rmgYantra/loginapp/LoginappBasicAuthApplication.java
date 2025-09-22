package com.rmgYantra.loginapp;

import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.service.EmployeeDAOService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


//@EnableEurekaClient
//@EnableJpaRepositories(basePackageClasses = EmployeeRepo.class )
@EnableJpaRepositories(basePackageClasses = EmployeeRepo.class )
@SpringBootApplication
public class LoginappBasicAuthApplication {
	
	@Autowired
	private EmployeeRepo employeeRepo;
	
	@Autowired
	private EmployeeDAOService employeeDAOService;

	public static void main(String[] args) {
		EmbeddedMySqlDevConfig.startEmbeddedMysql();
		SpringApplication.run(LoginappBasicAuthApplication.class, args);

	}
	
//	@Bean
//	public WebMvcConfigurer corsConfigurer() {   
//		return new WebMvcConfigurer() {
//			@Override
//			public void addCorsMappings(CorsRegistry registry) {
//				registry.addMapping("/login").allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH").allowedOrigins("http://localhost:4200");
//			}
//		};
//	}
	
	/*@Bean
	InitializingBean sendDatabase() {
		return ()->{
			Employee emp = new Employee();
			emp.setDesignation("SDET");
			emp.setEmail("demoacc@gmail.com");
			emp.setEmpName("admin");
			emp.setExperience(6);
			emp.setMobileNo("7259229999");
			emp.setProject("ADMIN_PROJECT");
			emp.setRole("admin");
			emp.setDob("05/10/1998");
			emp.setUsername("rmgyantra");
			if(!employeeRepo.findByUsername(emp.getUsername()).isPresent())
			employeeDAOService.addEmployee(emp);
			Employee emp1 = new Employee();
			emp1.setDesignation("Architect");
			emp1.setEmail("acoe@gmail.com");
			emp1.setEmpName("Super Admin");
			emp1.setExperience(16);
			emp1.setMobileNo("7259221111");
			emp1.setProject("ADMIN_PROJECT");
			emp1.setRole("user");
			emp1.setUsername("acoe");
			if(!employeeRepo.findByUsername(emp1.getUsername()).isPresent())
			employeeDAOService.addEmployee(emp1);

			Employee emp2 = new Employee();
			emp2.setDesignation("ASE");
			emp2.setEmail("jitu@gmail.com");
			emp2.setEmpName("jitu");
			emp2.setExperience(3);
			emp2.setMobileNo("7259222222");
			emp2.setProject("ADMIN_PROJECT");
			emp2.setRole("user");
			emp2.setUsername("jitu");
			if(!employeeRepo.findByUsername(emp2.getUsername()).isPresent())
				employeeDAOService.addEmployee(emp2);
		};
	}*/

}
