//package com.rmgYantra.loginapp.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.rmgYantra.loginapp.model.Feedback;
//import com.rmgYantra.loginapp.repo.FeedbackRepo;
//
//@RestController
//@CrossOrigin(origins = "*")
//public class FeedbackController {
//
//	@Autowired
//	private FeedbackRepo feedbackRepo;
//
//	@PostMapping("/feedback")
//	public ResponseEntity<?> sendFeedback(@RequestBody Feedback feedback){
//		try {
//			Feedback savedFeedback = feedbackRepo.save(feedback);
//			return new ResponseEntity(savedFeedback,HttpStatus.OK);
//		}catch (Exception e) {
//			return new ResponseEntity(e,HttpStatus.INTERNAL_SERVER_ERROR);
//
//		}
//
//
//	}
//
//}
