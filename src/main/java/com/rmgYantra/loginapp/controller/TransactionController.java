//package com.rmgYantra.loginapp.controller;
//
//import java.io.IOException;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.LinkedHashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.rmgYantra.loginapp.model.Project;
//import com.rmgYantra.loginapp.model.Transaction;
//import com.rmgYantra.loginapp.repo.TransactionRepo;
//import com.rmgYantra.loginapp.service.TransactionService;
//
//@RestController
//@CrossOrigin(origins = "*")
//public class TransactionController {
//
//	@Autowired
//	private TransactionService transactionService;
//
//	@Autowired
//	private TransactionRepo transactionRepo;
//
//	@PostMapping("/transactions")
//	public ResponseEntity<?> addTransaction(@RequestParam("file") MultipartFile jsonFile){
//
//		 List<Transaction> transactionList = new ArrayList<>();
//
//	        try {
//	            // Read JSON data from MultipartFile
//	            byte[] bytes = jsonFile.getBytes();
//	            String jsonData = new String(bytes);
//
//	            // Parse JSON data into list of transactions
//	            ObjectMapper objectMapper = new ObjectMapper();
//	            List<Transaction> transactions = objectMapper.readValue(jsonData, new TypeReference<List<Transaction>>(){});
//
//	            // Add transactions to transactionList
//	            transactionList.addAll(transactions);
//	            System.out.println(transactionList);
//	        } catch (IOException e) {
//	            e.printStackTrace();
//	        }
//
//			List<Transaction> savedTransactions = transactionService.addTransactions(transactionList);
//		return new ResponseEntity(savedTransactions,HttpStatus.OK);
//	}
//	@PostMapping("/add-transaction")
//	public ResponseEntity<?> addTransaction(@RequestBody Transaction transaction){
//		 Optional<Transaction> dbTransaction = transactionRepo.findById(transaction.getTransactionId());
//		 if(dbTransaction.isEmpty() == false)
//			 return new ResponseEntity("Transaction Already Exists",HttpStatus.INTERNAL_SERVER_ERROR);
//		Transaction savedTransaction = transactionRepo.save(transaction);
//		System.out.println(savedTransaction);
//		return new ResponseEntity(savedTransaction, HttpStatus.OK);
//	}
//	@GetMapping("/transaction")
//	public ResponseEntity<?> getTransactionDetails(@RequestParam("transactionId") String transactionId){
//		Transaction transaction = transactionRepo.findById(transactionId).get();
//		if(transaction != null)
//			return new ResponseEntity(transaction, HttpStatus.OK);
//		else {
//			Map<String, String> errorResponse = new LinkedHashMap<String, String>();
//			errorResponse.put("message", "Transaction Not Found");
//			return new ResponseEntity(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
//
//	@GetMapping("/count-transactions")
//	public long countTransactions() {
//		return transactionRepo.count();
//	}
//	@GetMapping("/all-transactions")
//	public Page<Transaction> getAllTransactions(Pageable pageable) {
//		Page<Transaction> transactions = transactionRepo.findAll(pageable);
//        return transactions;
//	}
//}
