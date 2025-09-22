package com.rmgYantra.loginapp.controller;

import com.rmgYantra.loginapp.model.FileEntityProjection;
import com.rmgYantra.loginapp.repo.FileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.rmgYantra.loginapp.service.DBFileStorageService;
import com.rmgYantra.loginapp.service.FileService;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"*","http://localhost:4201"})
public class FileController {

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private DBFileStorageService dbFileStorageService;
    
    @Autowired
    private FileService fileService;

	@Autowired
	private FileRepository fileRepository;
    
    @PostMapping(value="/uploadFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam MultipartFile file) {
			return fileService.saveFile(file);
    }

	@GetMapping("/fetch-file-details")
	public Page<FileEntityProjection> fetchAllPaginationFilesData(Pageable pageable){
		Page<FileEntityProjection> files = fileRepository.findAllProjectedBy(pageable);
		return files;
	}

	@GetMapping("/fetch-all-files")
	public ResponseEntity<Object> fetchAllFiles(){
		List<FileEntityProjection> files = fileRepository.findAllProjects();
		return new ResponseEntity(files, HttpStatus.OK);
	}

	@DeleteMapping("/delete-file/{id}")
	public ResponseEntity<Object> deleteFile(@PathVariable String id){
		return fileService.deleteFile(id);
	}

	@GetMapping("/file/download/{id}")
	public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String id) throws IOException {
		return fileService.downloadFile(id);
	}
}
