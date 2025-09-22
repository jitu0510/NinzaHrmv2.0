package com.rmgYantra.loginapp.model;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Transaction {
	
	@Id
	@JsonProperty("Transaction_ID")
	private String transactionId;
	
	@JsonProperty("Transaction_Mode")
	private String transactionMode;
	
	@JsonProperty("Transaction_Date")
	private String transactionDate;
	
	@JsonProperty("Transaction_Amount")
	private String amount;
	
	@JsonProperty("Transaction_Time")
	private String transactionTime;
	
	@JsonProperty("Transaction_Type")
	private String transactionType;
	
	@JsonProperty("Transaction_Status")
	private String transactionStatus;
	
	@JsonProperty("Description")
	private String description;
	
	@JsonProperty("Currency")
	private String currency;
	
	@JsonProperty("Location")
	private String location;
	
	@JsonProperty("Authorization_Code")
	private String authorizationCode;
	
	@JsonProperty("Merchant_Information")
	private String merchantInformation;
	
	@JsonProperty("Batch_Number")
	private String batchNumber;
	
	@JsonProperty("Recurring_Indicator")
	private String recurringIndicator;
	
	@JsonProperty("Tax_Information")
	private String taxInformation;
	
	@JsonProperty("Risk_Assessment_Score")
	private String riskAssessmentScore;
	
	@JsonProperty("Promotion_Coupon_Code")
	private String promotionCouponCode;
	
	@JsonProperty("Exchange_Rate")
	private String exchangeRate;

	@JsonProperty("Transaction_Code")
	private String transactionCode;
	
	@JsonProperty("Notes")
	private String notes;
	
	@JsonProperty("Reference_Number")
	private String referenceNumber;
	
	@JsonProperty("Device_Information")
	private String deviceInformation;
	
	@JsonProperty("MCC")
	private String mcc;
	
	@JsonProperty("CVM")
	private String cvm;
	
	@JsonProperty("Regulatory_Compliance_Information")
	private String regulatoryComplianceInformation;
	
	@JsonProperty("isUPITransaction")
	private String isUpiTransaction;
	
	@JsonProperty("Sender_Source")
	private String senderSource;
	
	@JsonProperty("Recipient_Destination")
	private String recipientDestination;
	
	@Embedded
	@JsonProperty("Payer_Details")
	private PayerDetails payerDetails;
	
	@Embedded
	@JsonProperty("Payee_Details")
	private PayeeDetails payeeDetails;
	
}
