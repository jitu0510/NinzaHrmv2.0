package com.rmgYantra.loginapp.controller;

import com.google.gson.Gson;
import com.rmgYantra.loginapp.model.Payroll;
import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.repo.PayrollRepo;
import com.rmgYantra.loginapp.service.AesService;
import com.rmgYantra.loginapp.service.PayrollService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@Slf4j
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private AesService aesService;

    @Autowired
    private PayrollRepo payrollRepo;

//    @PostMapping("/add-payroll")
//    public ResponseEntity<Object> addPayroll(@RequestBody Payroll payroll){
//        Payroll savedPayroll = payrollService.save(payroll);
//        if(savedPayroll != null){
//            return new ResponseEntity(savedPayroll, HttpStatus.OK);
//        }else{
//            return new ResponseEntity("Something Went Wrong",HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    @GetMapping("/admin/payrolls")
    public ResponseEntity<Object> getAllPayrolls(){
        log.info("GET /admin/payrolls called");
        List<Payroll> payrolls = payrollRepo.findAll();
        return new ResponseEntity(payrolls,HttpStatus.OK);
    }

    @GetMapping("/admin/payrolls-paginated")
    public Page<Payroll> getPaginatedPayrolls(Pageable pageable){
        log.info("GET /admin/payrolls-paginated called");
        Page<Payroll> payrolls = payrollService.findAllPayrolls(pageable);
        return payrolls;
    }

    @GetMapping("/admin/payroll/{payroll_id}")
    public ResponseEntity<Object> getPayrollBasedOnPayrollId(@PathVariable("payroll_id") String payroll_id){
        log.info("GET /admin/payroll/"+payroll_id+" called");
        Optional<Payroll> dbOptionalPayroll = payrollRepo.findById(Long.parseLong(payroll_id));
        if(dbOptionalPayroll.isPresent()){
            return new ResponseEntity<>(dbOptionalPayroll.get(),HttpStatus.OK);
        }
        return new ResponseEntity<>("Invalid Payroll_id",HttpStatus.NOT_FOUND);
    }
    //API to accept encrypted Payroll
    @PutMapping("/payroll")
    @ApiOperation(value = "Update Payroll using encrypted data",notes = "{ \"employee\": { \"empId\":\"string\", \"designation\": \"string\", \"dob\": \"dd/MM/yyyy\", \"email\": \"string\", \"empName\": \"string\", \"experience\": 0, \"mobileNo\": \"string\", \"project\": \"string\", \"role\": \"string\", \"username\": \"string\" }, \"basicPlusVda\": 0, \"hra\": 0, \"insurance\": 0, \"lta\": 0, \"lwf\": 0, \"netPay\": 0, \"payroll_id\": 0, \"pf\": 0, \"pt\": 0, \"stat_bonus\": 0, \"status\": \"Active/Disabled\" }")
    public ResponseEntity<Object> updatePayrollUsingEncryptedData(@RequestBody String encryptedUpdatedPayroll) throws Exception {
        log.info("PUT /payroll called");

        encryptedUpdatedPayroll = encryptedUpdatedPayroll.trim();
        String decryptedData = aesService.decrypt(encryptedUpdatedPayroll);
        Gson gson = new Gson();
        Payroll updatedPayroll = gson.fromJson(decryptedData, Payroll.class);
        double earnings = updatedPayroll.getBasicPlusVda()+updatedPayroll.getHra()+updatedPayroll.getStat_bonus()+updatedPayroll.getLta();
        double deductions = updatedPayroll.getPf()+updatedPayroll.getPt()+updatedPayroll.getInsurance()+updatedPayroll.getLwf();
        double netPay = earnings - deductions;
        updatedPayroll.setNetPay(netPay);
       Payroll savedPayroll = payrollService.update(updatedPayroll);
       if(savedPayroll != null){
           String encryptedSavedPayroll = null;
           encryptedSavedPayroll = aesService.encrypt(savedPayroll.toString());
           return new ResponseEntity(encryptedSavedPayroll,HttpStatus.OK);
       }else{
           return new ResponseEntity("Data Cannot be Updated",HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    @PutMapping("/update-payroll")
    public ResponseEntity<Object> updatePayroll(@RequestBody Payroll updatedPayroll){
        log.info("PUT /update-payroll called");
        Payroll savedPayroll = payrollService.update(updatedPayroll);
        if(savedPayroll != null){
            return new ResponseEntity(savedPayroll,HttpStatus.OK);
        }else{
            log.error("Data Cannot be Updated");
            return new ResponseEntity("Data Cannot be Updated",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/payroll/{id}")
    public ResponseEntity<Object> updatePayrollUsingPatchApi(@PathVariable("id") Long payrollId, @RequestBody Payroll payroll){
        log.info("PATCH /payroll/{id} called");
        if(payroll.getBasicPlusVda() < 0 || payroll.getStat_bonus() < 0 || payroll.getLta() < 0 ||
        payroll.getHra() < 0 || payroll.getLwf() < 0 || payroll.getPf() < 0 || payroll.getPt() < 0 ||
        payroll.getInsurance() < 0){
            return new ResponseEntity("Payroll Component Cannot be Negative Value", HttpStatus.BAD_REQUEST);
        }
        if(payroll.getNetPay() != 0){
            return new ResponseEntity("NetPay is dependent on other Payroll Components and cannot be directly modified",HttpStatus.BAD_REQUEST);
        }
        if(payroll.getStatus() != null){
            if(payroll.getStatus().equalsIgnoreCase("active")){
                payroll.setStatus("Active");
            }
            else if(payroll.getStatus().equalsIgnoreCase("disabled")){
                payroll.setStatus("Disabled");
            }else{
                log.error("Invalid Status");
                return new ResponseEntity("Invalid Status",HttpStatus.BAD_REQUEST);
            }
        }
        Payroll savedPayroll = payrollService.updatePayrollUsingPatchApi(payrollId,payroll);
        return new ResponseEntity(savedPayroll,HttpStatus.OK);


    }

}
