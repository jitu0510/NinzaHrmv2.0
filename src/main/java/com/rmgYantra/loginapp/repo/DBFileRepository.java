package com.rmgYantra.loginapp.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rmgYantra.loginapp.model.DBFile;

@Repository
public interface DBFileRepository extends JpaRepository<DBFile, String> {

}
