package com.rmgYantra.loginapp.model;

import java.nio.file.Path;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "files")
@NoArgsConstructor
@Getter
@Setter
public class DBFile {
	
    @Id
    @GeneratedValue
    private int id;

    private String fileName;

    private String fileType;
    
    @Convert(converter = PathConverter.class)
    private Path path;
    
    public DBFile(String fileName, String fileType, Path path) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.path = path;
    }
}
