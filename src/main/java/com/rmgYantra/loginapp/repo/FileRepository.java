package com.rmgYantra.loginapp.repo;

import com.rmgYantra.loginapp.model.FileEntityProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rmgYantra.loginapp.model.FileEntity;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, String> {
    @Query("SELECT f.id AS id, f.fileName AS fileName,f.fileSize as fileSize,f.downloads as downloads , f.uploadedOn AS uploadedOn FROM FileEntity f")
    Page<FileEntityProjection> findAllProjectedBy(Pageable pageable);

    @Query("SELECT f.id AS id, f.fileName AS fileName,f.fileSize as fileSize,f.downloads as downloads ,f.uploadedOn AS uploadedOn FROM FileEntity f")
    List<FileEntityProjection> findAllProjects();

}

