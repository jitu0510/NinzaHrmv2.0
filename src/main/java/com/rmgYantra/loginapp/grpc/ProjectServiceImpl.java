package com.rmgYantra.loginapp.grpc;

import com.rmgYantra.loginapp.proto.*;
import com.rmgYantra.loginapp.proto.Project;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import com.rmgYantra.loginapp.repo.ProjectRepo;
import java.util.ArrayList;
import java.util.List;
//import com.rmgYantra.loginapp.model.Project;
@GrpcService
public class ProjectServiceImpl extends ProjectServiceGrpc.ProjectServiceImplBase {

    @Autowired
    private ProjectRepo projectRepo;

    @Override
    public void getAllProjects(Empty request, StreamObserver<ProjectList> responseObserver) {
        // Fetch projects data from your data source (e.g., database)
        List<Project> projects = fetchProjectsFromDataSource();

        // Create ProjectList response
        ProjectList projectList = ProjectList.newBuilder().addAllProjects((Iterable<? extends Project>) projects).build();
        responseObserver.onNext(projectList);
        responseObserver.onCompleted();
    }

    private List<Project> fetchProjectsFromDataSource() {
        List<Project> projects = new ArrayList<>();
        List<com.rmgYantra.loginapp.model.Project> dbDrojects = projectRepo.findAll();
        for(com.rmgYantra.loginapp.model.Project p: dbDrojects){
            projects.add(Project.newBuilder().setProjectId(p.getProjectId()).setProjectName(p.getProjectName()).setTeamSize(p.getTeamSize()).setCreatedBy(p.getCreatedBy()).setCreatedOn(p.getCreatedOn()).setStatus(p.getStatus()).build());
        }

        return projects;
    }
    @Override
    public void getProjectById(ProjectId request, StreamObserver<Project> responseObserver) {
        String projectId = request.getProjectId();
        // Find project by ID using Spring Data JPA repository
        com.rmgYantra.loginapp.model.Project project = projectRepo.findById(projectId).orElse(null);

        if (project != null) {
           Project proj = Project.newBuilder().setProjectId(project.getProjectId()).setProjectName(project.getProjectName())
                            .setTeamSize(project.getTeamSize())
                            .setCreatedBy(project.getCreatedBy())
                            .setCreatedOn(project.getCreatedOn())
                            .setStatus(project.getStatus()).build();
            responseObserver.onNext(proj);
            responseObserver.onCompleted();
        } else {
            responseObserver.onError(new RuntimeException("Project not found for ID: " + projectId));
        }
    }
}
