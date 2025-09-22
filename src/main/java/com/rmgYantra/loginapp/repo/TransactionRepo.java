package com.rmgYantra.loginapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rmgYantra.loginapp.model.Transaction;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, String>{

}
