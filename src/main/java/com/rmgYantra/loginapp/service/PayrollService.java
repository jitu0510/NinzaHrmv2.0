package com.rmgYantra.loginapp.service;

import com.rmgYantra.loginapp.model.Payroll;
import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.repo.PayrollRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepo payrollRepo;

    public Payroll save(Payroll payroll){
       return  payrollRepo.save(payroll);
    }

    public Payroll update(Payroll updatedPayroll) {
        Optional<Payroll> optionalPayroll = payrollRepo.findById(updatedPayroll.getPayroll_id());
        if(optionalPayroll.isPresent()){
            Payroll dbPayroll = optionalPayroll.get();
            dbPayroll.setHra(updatedPayroll.getHra());
            dbPayroll.setInsurance(updatedPayroll.getInsurance());
            dbPayroll.setNetPay(updatedPayroll.getNetPay());
            dbPayroll.setLta(updatedPayroll.getLta());
            dbPayroll.setLwf(updatedPayroll.getLwf());
            dbPayroll.setBasicPlusVda(updatedPayroll.getBasicPlusVda());
            dbPayroll.setPf(updatedPayroll.getPf());
            dbPayroll.setPt(updatedPayroll.getPt());
            dbPayroll.setStat_bonus(updatedPayroll.getStat_bonus());
            dbPayroll.setStatus(updatedPayroll.getStatus());
            Payroll savedPayroll = payrollRepo.save(dbPayroll);
            return  savedPayroll;
        }else{
            return null;
        }

    }

    public Page<Payroll> findAllPayrolls(Pageable pageable) {
        List<Payroll> allPayrolls = payrollRepo.findAll();
        // Reverse the order of the list
        Collections.reverse(allPayrolls);
        // Create a sublist based on the specified Pageable
        int pageSize = pageable.getPageSize();
        int pageNumber = pageable.getPageNumber();
        int fromIndex = pageNumber * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, allPayrolls.size());
        List<Payroll> pageContent = allPayrolls.subList(fromIndex, toIndex);
        // Create a Page object with the reversed and paginated data
        return new PageImpl<>(pageContent, pageable, allPayrolls.size());
    }

    public Payroll updatePayrollUsingPatchApi(Long payrollId,Payroll payroll){
        Optional<Payroll> dbPayrollOptional = payrollRepo.findById(payrollId);
        if(!dbPayrollOptional.isPresent())
            return null;
        Payroll dbPayroll = dbPayrollOptional.get();
        if(payroll.getBasicPlusVda() != 0) {
            dbPayroll.setBasicPlusVda(payroll.getBasicPlusVda());
        }
        if(payroll.getHra() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()+payroll.getHra());
            dbPayroll.setHra(payroll.getHra());
        }
        if(payroll.getStat_bonus() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()+payroll.getStat_bonus());
            dbPayroll.setStat_bonus(payroll.getStat_bonus());
        }
        if(payroll.getLta() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()+payroll.getLta());
            dbPayroll.setLta(payroll.getLta());
        }
        if(payroll.getPt() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()-payroll.getPt());
            dbPayroll.setPt(payroll.getPt());
        }
        if(payroll.getPf() != 0){
            dbPayroll.setNetPay(dbPayroll.getNetPay()-payroll.getPf());
            dbPayroll.setPf(payroll.getPf());
        }
        if(payroll.getInsurance() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()-payroll.getInsurance());
            dbPayroll.setInsurance(payroll.getInsurance());
        }
        if(payroll.getLwf() != 0) {
            dbPayroll.setNetPay(dbPayroll.getNetPay()-payroll.getLwf());
            dbPayroll.setLwf(payroll.getLwf());
        }
        if(payroll.getStatus() != null)
            dbPayroll.setStatus(payroll.getStatus());
        dbPayroll.setNetPay((dbPayroll.getBasicPlusVda()+dbPayroll.getStat_bonus()+dbPayroll.getHra()+dbPayroll.getLta())-
                (dbPayroll.getPt()+dbPayroll.getPf()+dbPayroll.getInsurance()+dbPayroll.getLwf()));
        Payroll savedPayroll = payrollRepo.save(dbPayroll);
        return savedPayroll;

    }
}
