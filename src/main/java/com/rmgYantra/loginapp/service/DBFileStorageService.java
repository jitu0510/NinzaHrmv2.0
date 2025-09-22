package com.rmgYantra.loginapp.service;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rmgYantra.loginapp.model.DBFile;
import com.rmgYantra.loginapp.repo.DBFileRepository;



@Service
public class DBFileStorageService {

    @Autowired
    private DBFileRepository dbFileRepository;

    public DBFile storeFile(MultipartFile file) throws Exception{
        String folder="C:\\Users\\Jitu\\Desktop\\java";
		byte[] bytes = file.getBytes();
		Path path = Paths.get(folder+file.getOriginalFilename());
		Files.write(path, bytes);
		DBFile dbFile = new DBFile(file.getOriginalFilename(), file.getContentType(), path);
		return dbFileRepository.save(dbFile);
    }
    
   
}
