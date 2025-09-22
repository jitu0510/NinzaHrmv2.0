package com.rmgYantra.loginapp.model;

import javax.persistence.Embeddable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PayerDetails {
	
	@JsonProperty("Payer_PSP")
	private String payerPsp;
	
	@JsonProperty("Payer_Name")
	private String payerName;
	
	@JsonProperty("Bank_Account")
	private String payerBankAccount;
	
	@JsonProperty("IFSC")
	private String payerIfsc;
	
	@JsonProperty("Account_Type")
	private String payerAccountType;
	
	@JsonProperty("Address")
	private String payerAddress;
	
	@JsonProperty("Mobile_Number")
	private String payerMobileNumber;
	
	@JsonProperty("Mail_Id")
	private String payerEmailId;
	
	
	
	@JsonProperty("Ip_Address")
	private String ipAddress;
	
	@JsonProperty("Balance")
	private String balance;

}
