package com.rmgYantra.loginapp.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;
import java.util.List;


import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.rmgYantra.loginapp.model.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

import com.rmgYantra.loginapp.exceptions.ModuleNameAlreadyPresentException;
import com.rmgYantra.loginapp.exceptions.ProjectNameAlreadyPresentException;
import com.rmgYantra.loginapp.exceptions.ResourceNotFoundException;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.repo.ProjectModuleRepo;
import com.rmgYantra.loginapp.repo.ProjectRepo;
import com.rmgYantra.loginapp.service.ProjectDAOService;

import graphql.GraphQL;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.DataFetcher;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaGenerator;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;

@RestController
@CrossOrigin(origins = {"*","http://localhost:4200"})
@Slf4j
public class ProjectController {

	private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

	@Autowired
	public ProjectDAOService projDAOService;

	@Autowired
	public ProjectRepo projRepo;
	
	@Autowired
	private ProjectModuleRepo moduleRepo;
	
	@Autowired
	private EmployeeRepo employeeRepo;

	
//	@Value("classpath:src/main/resources/project.graphql")
//	private Resource schemaResource;

	private GraphQL graphQL;

	@PostConstruct
	public void loadSchema() throws IOException {
		try {
			InputStream inputStream = ResourceUtils.getURL("classpath:project.graphql").openStream();
			String schemaDefinition = new BufferedReader(new InputStreamReader(inputStream))
					.lines().collect(Collectors.joining("\n"));
			TypeDefinitionRegistry registry = new SchemaParser().parse(schemaDefinition);
			RuntimeWiring wiring = buildWiring();
			GraphQLSchema schema = new SchemaGenerator().makeExecutableSchema(registry, wiring);
			graphQL = GraphQL.newGraphQL(schema).build();
		} catch (IOException e) {
			log.error("Error {}",e.getMessage());
		}
	}

	private RuntimeWiring buildWiring() {
		DataFetcher<List<Project>> fetcher1 = data -> (List<Project>) projRepo.findAll();

		DataFetcher<Project> fetcher2 = data -> projRepo.findById(data.getArgument("projectId")).orElse(null);

		DataFetcher<List<Employee>> fetcher3 = data -> employeeRepo.findByProject(data.getArgument("projectId"));

		DataFetcher<Project> addProjectFetcher = data -> {
			Map<String, Object> arguments = data.getArguments();
			Project project = new Project();
			project.setProjectId((String) arguments.get("projectId"));
			project.setProjectName((String) arguments.get("projectName"));
			project.setTeamSize((Integer) arguments.get("teamSize"));
			project.setCreatedBy((String) arguments.get("createdBy"));
			project.setCreatedOn((String) arguments.get("createdOn"));
			project.setStatus((String) arguments.get("status"));
			return projRepo.save(project);
		};

		DataFetcher<Project> updateProjectFetcher = data -> {
			String projectId = data.getArgument("projectId");
			Project project = projRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
			project.setProjectName(data.getArgument("projectName"));
			//project.setTeamSize(data.getArgument("teamSize"));
			project.setCreatedBy(data.getArgument("createdBy"));
			project.setCreatedOn(data.getArgument("createdOn"));
			project.setStatus(data.getArgument("status"));
			return projRepo.save(project);
		};

		return RuntimeWiring.newRuntimeWiring()
				.type("Query", typeWiring -> typeWiring
						.dataFetcher("getAllProjects", fetcher1)
						.dataFetcher("findProject", fetcher2)
						.dataFetcher("findEmployees",fetcher3))

				.type("Mutation", typeWiring -> typeWiring
						.dataFetcher("addProject", addProjectFetcher)
						.dataFetcher("updateProject", updateProjectFetcher))
				.build();
	}
	
	//graphql API
	@PostMapping("/getAll")
	@ApiOperation("Get all projects ,Sample query:  {\n" +
			"    getAllProjects{\n" +
			"        projectId\n" +
			"        projectName\n" +
			"        status\n" +
			"    }\n" +
			"}")
	public ResponseEntity<Object> getAll(@RequestBody String query) {
		log.info("POST /getAll called");
		ExecutionResult result = graphQL.execute(query);
		return new ResponseEntity<Object>(result, HttpStatus.OK);
	}
	
	//graphql API
	@PostMapping("/getProjectByProjectId")
	@ApiOperation("Find project by projectId ,Sample query:  {\n" +
			"    findProject(projectId:\"NH_PROJ_***\"){\n" +
			"        projectId\n" +
			"        projectName\n" +
			"        status\n" +
			"        createdBy\n" +
			"        teamSize\n" +
			"    }\n" +
			"}")
	public ResponseEntity<Object> getProjectByProjectId(@RequestBody String query) {
		log.info("POST /getProjectByProjectId called");
		ExecutionResult result = graphQL.execute(query);
		return new ResponseEntity<Object>(result, HttpStatus.OK);
	}

	// New API to add a project
	//graphQL API
	@PostMapping("/addProject-graphql")
	@ApiOperation("Add Project ,Sample query:  mutation {\n" +
			"  addProject(\n" +
			"    projectName: \"Project Name\",\n" +
			"    teamSize: 5,\n" +
			"    createdBy: \"John Doe\",\n" +
			"    createdOn: \"2024-07-05\",\n" +
			"    status: \"Created\"\n" +
			"  ) {\n" +
			"    projectId\n" +
			"    projectName\n" +
			"    teamSize\n" +
			"    createdBy\n" +
			"    createdOn\n" +
			"    status\n" +
			"  }\n" +
			"}")
	public ResponseEntity<Object> addProject(@RequestBody String query) {
		log.info("POST /addProject-graphql called");
		ExecutionResult result = graphQL.execute(query);
		return new ResponseEntity<>(result, HttpStatus.CREATED);
	}

	// New API to update a project
	//graphQL API
	@PostMapping("/updateProject-graphql")
	@ApiOperation("Update Project ,Sample query: mutation {\n" +
			"  updateProject(\n" +
			"    projectId: \"NH_PROJ_***\"\n" +
			"    projectName: \"Updated Project Name\",\n" +
			"    teamSize: 1,\n" +
			"    createdBy: \"John Doe\",\n" +
			"    createdOn: \"2024-07-05\",\n" +
			"    status: \"Created\"\n" +
			"  ) {\n" +
			"    projectId\n" +
			"    projectName\n" +
			"    teamSize\n" +
			"    createdBy\n" +
			"    createdOn\n" +
			"    status\n" +
			"  }\n" +
			"}\n")
	public ResponseEntity<Object> updateProject(@RequestBody String query) {
		log.info("POST /updateProject-graphql called");
		ExecutionResult result = graphQL.execute(query);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	//graphQL API
	@PostMapping("/getEmployeesByProjectId-graphql")
	@ApiOperation("Get employees based on projectId ,Sample query:  {\n" +
			"findEmployees(projectId:\"NH_PROJ_***\"){\n" +
			"empId\n" +
			"empName\n" +
			"mobileNo\n" +
			"email\n" +
			"dob\n" +
			"experience\n" +
			"username\n" +
			"designation\n" +
			"role\n" +
			"project\n" +
			"    }\n" +
			"}")
	public ResponseEntity<Object> getEmployeesBasedOnProjectId(@RequestBody String query){
		log.info("POST /getEmployeesByProjectId-graphql called");
		ExecutionResult result = graphQL.execute(query);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}




//	@GetMapping(value = "/project",produces = {"application/json"})
//	public ResponseEntity<Object> getProjectUsingProjectId(@RequestParam("projectId") String projectId){
//		Project dbProject = projRepo.findByProjectId(projectId);
//		if(dbProject != null){
//			return new ResponseEntity(dbProject, HttpStatus.OK);
//		}
//		return new ResponseEntity("Invalid Project Id",HttpStatus.NOT_FOUND);
//	}

    //API to accept json and XML
	@PostMapping(path="/addProject",consumes = { "application/json", "application/xml" })
	public ResponseEntity addProject(@Valid @RequestBody Project project) throws InterruptedException {
		log.info("POST /addProject called");
		if(projRepo.findByProjectName(project.getProjectName()).isPresent())
		{
			log.error("The Project Name :"+project.getProjectName()+" Already Exists");
			throw new ProjectNameAlreadyPresentException("The Project Name :"+project.getProjectName()+" Already Exists");
		}
		Project proj = projDAOService.addProject(project);
		HashMap<String, String> hm = new HashMap<>();
		hm.put("projectName", proj.getProjectName());
		hm.put("projectId", proj.getProjectId());
		hm.put("createdOn", proj.getCreatedOn());
		hm.put("status",proj.getStatus()); 
		hm.put("createdBy", proj.getCreatedBy());
		hm.put("msg", "Successfully Added");
		ResponseEntity re = new ResponseEntity(hm, HttpStatus.CREATED);
		Thread.sleep(1000);
		return re;
	}

	@GetMapping("/projects")
	public List<Project> getAllProjects() {
		logger.debug("GET /projects called");
		List<Project> projects = projRepo.findAll();
		return projects;
	}
	@GetMapping("/projects-paginated")
	public Page<Project> getAllProjects(Pageable pageable) {
		logger.debug("GET /projects-paginated called");
		Page<Project> projects = projDAOService.findAllProjects(pageable);
        return projects;
	}

	@GetMapping("/count-projects")
	public Long getProjectsCounts()
	{
		logger.debug("GET /count-projects called");
		return projRepo.count();
	}
	
	@GetMapping("/project/{projectId}")
	public Project getSingleProject(@PathVariable String projectId) {
		logger.debug("GET /project/"+projectId+" called");
		return projRepo.findById(projectId).get();
	}

	@PutMapping("/project/{projectId}")
	public ResponseEntity<Project> updateProject(@PathVariable String projectId, @RequestBody Project project) {
		logger.debug("PUT /project/"+projectId+" called");
		Project proj = projRepo.findById(projectId)
				.orElseThrow(() -> new ResourceNotFoundException("Project Not Found For the Id::" + projectId));

		if(project.getProjectId() != null){
			if(!project.getProjectId().equals(projectId)){
				log.error("projectId cannot be modified");
				throw new RuntimeException("projectId cannot be modified");
			}
		}
		if(project.getCreatedBy() != null)
			proj.setCreatedBy(project.getCreatedBy());
		if(project.getProjectName() != null)
			proj.setProjectName(project.getProjectName());

		if(project.getTeamSize() != proj.getTeamSize()) {
			log.error("Team size cannot be modified through API call");
			throw new RuntimeException("Team size cannot be modified through API call");
		}
		if(project.getStatus() != null)
			proj.setStatus(project.getStatus());
		if(project.getCreatedOn() != null)
			proj.setCreatedOn(project.getCreatedOn());
		Project updatedProject = projRepo.save(proj);
		log.info("Project Updated Successfully");
		return ResponseEntity.ok(updatedProject);
	}

	@DeleteMapping("/project/{projectId}")
	public ResponseEntity deleteProject(@PathVariable String projectId) {
			logger.debug("DELETE /project/"+projectId+" called");
		   Project project = projRepo.findByProjectId(projectId);
		   List<Employee> employees = employeeRepo.findByProject(projectId);
		if (project!=null && employees.size()==0) {
			projDAOService.deleteProject(projectId);
			HashMap<String, String> hm = new HashMap<>();
			hm.put("msg", "resource deleted successfully");
			ResponseEntity re = new ResponseEntity(hm, HttpStatus.NO_CONTENT);
			return re;
		} else {

			log.error("Project Not Found For the Id::" + projectId);
			throw new ResourceNotFoundException("Project Not Found For the Id::" + projectId);
		}
	}
	
//	@PostMapping("/addmodule")
//	public ResponseEntity<?> addModule(@RequestBody ProjectModule module){
//		if(moduleRepo.findByModuleName(module.getModuleName()).isPresent())
//		{
//			throw new ModuleNameAlreadyPresentException("The Module Name :"+module.getModuleName()+" Already Exists");
//		}
//
//		ProjectModule projectModule = projDAOService.addModule(module);
//		HashMap<String, String> hm = new HashMap<>();
//		hm.put("moduleName", projectModule.getModuleName());
//		hm.put("moduleId", projectModule.getModuleId());
//		hm.put("createdOn", projectModule.getCreatedOn());
//		hm.put("status",projectModule.getStatus());
//		hm.put("assignedTo", projectModule.getAssignedTo());
//		hm.put("assignedOn", projectModule.getAssignedOn());
//		hm.put("msg", "Successfully Added");
//		ResponseEntity<?> responseEntity = new ResponseEntity(hm, HttpStatus.CREATED);
//		return responseEntity;
//	}
	
//	@GetMapping("/all-modules/{projectid}")
//	public Page<ProjectModule> getAllModules(@PathVariable("projectid") String projectid,Pageable pageable) {
//		Page<ProjectModule> modules = moduleRepo.findAll(pageable);
//		return modules;
//	}
	
	@GetMapping("/project-status-data")
	public ResponseEntity<?> getProjectsStatusData(){
		log.info("GET /project-status-data called");
		ProjectStatus projectStatus = projDAOService.getProjectsStatusData();
		if(projectStatus != null) {
			return new ResponseEntity(projectStatus,HttpStatus.OK);
		}else {
			return new ResponseEntity(projectStatus,HttpStatus.INTERNAL_SERVER_ERROR);
		}		
	}

	@GetMapping("/project/**")
	@ApiOperation("Search projects based on multiple factors i.e /project?manager=deepak or /project?projectId=NH_PROJ_001 or /project?projectName=project1")
	public ResponseEntity<Object> SearchProjectBasedOnCriteria(HttpServletRequest request, @RequestParam Map<String, String> params) {
		log.info("GET /project/** called");
		if(params.size() > 1){
			return new ResponseEntity("Invalid URI",HttpStatus.BAD_REQUEST);
		}
		String uri = request.getRequestURI();
		StringBuilder response = new StringBuilder("Path: " + uri + "\n");

		// Add all parameters to the response
		String key = null;
		for (Map.Entry<String, String> entry : params.entrySet()) {
			response.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
			key = entry.getKey();
		}

		if(key.equalsIgnoreCase("manager")){
			List<Project> projects = projRepo.findByCreatedByIgnoreCase(params.get(key));
			return new ResponseEntity(projects,HttpStatus.OK);
		}else if(key.equalsIgnoreCase("projectId")){
			Project project = projRepo.findByProjectId(params.get(key));
			return  new ResponseEntity(project,HttpStatus.OK);
		}else if(key.equalsIgnoreCase("projectName")){
			Optional<Project> optionalProject = projRepo.findByProjectName(params.get(key));
			if(optionalProject.isPresent()){
					Project project = optionalProject.get();
					return new ResponseEntity(project,HttpStatus.OK);
			}else{
				return new ResponseEntity("Project Not Found",HttpStatus.NOT_FOUND);
			}
		}else if(key.equalsIgnoreCase("teamSize")){
			List<Project> projects = projRepo.findByTeamSize(Integer.parseInt(params.get(key)));
			return  new ResponseEntity(projects,HttpStatus.OK);
		}else{
			return new ResponseEntity("Invalid key",HttpStatus.BAD_REQUEST);
		}

	}

	@PatchMapping("/project/{id}")
	public ResponseEntity<?> updateProjectUsingPatchApi(@PathVariable("id") String projectId,@RequestBody Project project){
		log.info("PATCH /project/"+projectId+" called");
		if(project.getProjectId() != null) {
			log.error("Project Id Cannot be Updated");
			return new ResponseEntity("Project Id Cannot be Updated", HttpStatus.BAD_REQUEST);
		}
		if(project.getTeamSize() != 0) {
			log.error("Team Size Cannot be Updated through API");
			return new ResponseEntity("Team Size Cannot be Updated through API", HttpStatus.BAD_REQUEST);
		}
		Project savedProject = projDAOService.updateProjectUsingPatchApi(projectId, project);
		log.info("Project Updated");
		if(savedProject != null)
			return new ResponseEntity(savedProject,HttpStatus.OK);
		log.error("Invalid Project Id");
		return new ResponseEntity("Invalid Project Id",HttpStatus.BAD_REQUEST);
	}

	@PostMapping("/project")
	public ResponseEntity<Object> searchProject(@RequestParam String projectId){
		log.info("POST /project called");
		Project project = projRepo.findByProjectId(projectId);
		if(project != null) {
			log.info("Project Found");
			return new ResponseEntity(project, HttpStatus.OK);
		}
		log.error("Invalid Project Id");
		return new ResponseEntity("Invalid Project Id", HttpStatus.NOT_FOUND);
	}
}
