package com.rmgYantra.loginapp.model;

import javax.persistence.Embeddable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PayeeDetails {
		
	@JsonProperty("Payee_PSP")
	private String payeePsp;
	
	@JsonProperty("Payee_Name")
	private String payeeName;
	
	@JsonProperty("Bank_Account")
	private String payeeBankAccount;
	
	@JsonProperty("IFSC")
	private String payeeIfsc;
	
	@JsonProperty("Account_Type")
	private String payeeAccountType;
	
	@JsonProperty("Address")
	private String payeeAddress;
	
	@JsonProperty("Mobile_Number")
	private String payeeMobileNumber;
	
	@JsonProperty("Mail_Id")
	private String payeeEmailId;
	
	

}
