package com.rmgYantra.loginapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long payroll_id;

//    private String employeeName;
//    private String designation;

    //earning

    private double basicPlusVda;
    private double hra;
    private double stat_bonus;
    private double lta;

    //deductions
    private double pf;
    private double pt;
    private double insurance;
    private double lwf;

    private double netPay;

    private String status;

    @OneToOne
    private Employee employee;


}
