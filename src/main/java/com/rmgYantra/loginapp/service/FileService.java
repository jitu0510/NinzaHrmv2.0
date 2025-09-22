package com.rmgYantra.loginapp.service;

import com.rmgYantra.loginapp.util.GenericUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.rmgYantra.loginapp.model.FileEntity;
import com.rmgYantra.loginapp.repo.FileRepository;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private GenericUtil genericUtil;

    public ResponseEntity<Object> saveFile(MultipartFile multipartFile) {
        FileEntity fileEntity = new FileEntity();
        try {
            // Calculate the size of the file in bytes
            long fileSizeInBytes = multipartFile.getSize();
            // Convert size to human-readable format (e.g., KB, MB)
            String readableFileSize = genericUtil.convertBytesToReadableSize(fileSizeInBytes);
           // System.out.println(readableFileSize);
            fileEntity.setFileSize(readableFileSize);
            fileEntity.setFileName(multipartFile.getOriginalFilename());
            fileEntity.setFileData(multipartFile.getBytes());
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            String formattedDate = formatter.format(new Date());
            fileEntity.setUploadedOn(formattedDate);
            FileEntity savedFile = fileRepository.save(fileEntity);
            savedFile.setFileData("Hidden".getBytes(StandardCharsets.UTF_8));
            return new ResponseEntity(savedFile,HttpStatus.CREATED);
        } catch (Exception e){
            if(e.getMessage().contains("ConstraintViolationException"))
                return new ResponseEntity("File Name Already Exist",HttpStatus.CONFLICT);
            return new ResponseEntity("File Couldn't be Uploaded",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public FileEntity getFile(String fileId) {
        return fileRepository.findById(fileId).orElse(null);
    }

    @Transactional(readOnly = true)
    public FileEntity getFileData(String id) {
        FileEntity fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        return fileEntity;
    }
    public ResponseEntity<Object> deleteFile(String fileId){
        try {
            fileRepository.deleteById(fileId);
            return new ResponseEntity("File Deleted Successfully", HttpStatus.NO_CONTENT);
        }catch (Exception e){
            return new ResponseEntity("Invalid File Id",HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<ByteArrayResource> downloadFile(String id){
        FileEntity fileEntity = this.getFileData(id);
        // Get file data
        byte[] fileData = fileEntity.getFileData();
        // Get filename
        String fileName = fileEntity.getFileName();
        // Set content type
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentLength(fileData.length);
//		headers.setContentDispositionFormData("attachment", fileName);
        // Return response with file data and filename
        ByteArrayResource resource = new ByteArrayResource(fileData);
        //increment downloads value
        fileEntity.setDownloads(fileEntity.getDownloads()+1);
        fileRepository.save(fileEntity);
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(fileData.length)
                .body(resource);
    }
}

