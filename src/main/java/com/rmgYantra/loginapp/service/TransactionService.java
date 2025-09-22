package com.rmgYantra.loginapp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rmgYantra.loginapp.exceptions.TransactionIdAlreadyExistsException;
import com.rmgYantra.loginapp.model.Transaction;
import com.rmgYantra.loginapp.repo.TransactionRepo;

@Service
public class TransactionService {
	
	@Autowired
	private TransactionRepo transactionRepo;
	
	@Transactional
	public List<Transaction> addTransactions(List<Transaction> transactions)  {
		List<Transaction> savedTransactions = new ArrayList<Transaction>();
		for(Transaction transaction : transactions) {
			
			Optional<Transaction> dbTransaction = transactionRepo.findById(transaction.getTransactionId());
			//System.out.println(dbTransaction.isEmpty());
			if(dbTransaction.isEmpty() == false)
				throw new TransactionIdAlreadyExistsException("Transaction_Id: "+transaction.getTransactionId()+" Already Exists");
			Transaction t = transactionRepo.save(transaction);
			savedTransactions.add(t);
		}
		return savedTransactions;
	}
	
	@Transactional
	public Transaction addTransaction(Transaction transaction) {
		Transaction savedTransaction = transactionRepo.save(transaction);
		return savedTransaction;
	}

}
