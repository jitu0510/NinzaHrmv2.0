package com.rmgYantra.loginapp;

import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.repo.ProjectRepo;
import com.rmgYantra.loginapp.service.EmployeeDAOService;
import com.rmgYantra.loginapp.service.ProjectDAOService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder {

    @Autowired
    private EmployeeDAOService employeeDAOService;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private ProjectDAOService projectDAOService;

    @EventListener(ApplicationReadyEvent.class)
    public void seedDatabase() {

        Project project1 = new Project();
        project1.setProjectName("Project1");
        project1.setCreatedBy("");
        project1.setStatus("Created");
        project1.setTeamSize(0);
        project1 = projectDAOService.addProject(project1);


        Employee emp = new Employee();
        emp.setDesignation("SDET");
        emp.setEmail("demoacc@gmail.com");
        emp.setEmpName("admin");
        emp.setExperience(6);
        emp.setMobileNo("7259229999");
        emp.setProject(project1.getProjectId());
        emp.setRole("ROLE_ADMIN");
        emp.setUsername("rmgyantra");

        if (!employeeRepo.findByUsername(emp.getUsername()).isPresent())
            employeeDAOService.addEmployee(emp);

        Project project2 = new Project();
        project2.setProjectName("Project2");
        project2.setCreatedBy("");
        project2.setStatus("Created");
        project2.setTeamSize(0);
        project2 = projectDAOService.addProject(project2);

        Employee emp1 = new Employee();
        emp1.setDesignation("Architect");
        emp1.setEmail("acoe@gmail.com");
        emp1.setEmpName("Super Admin");
        emp1.setExperience(16);
        emp1.setMobileNo("7259221111");
        emp1.setProject("ADMIN_PROJECT");
        emp1.setRole("ROLE_ADMIN");
        emp1.setUsername("acoe");
        emp1.setProject(project2.getProjectId());

        if (!employeeRepo.findByUsername(emp1.getUsername()).isPresent())
            employeeDAOService.addEmployee(emp1);
    }
}

