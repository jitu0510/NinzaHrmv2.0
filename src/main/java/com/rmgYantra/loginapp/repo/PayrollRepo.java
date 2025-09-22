package com.rmgYantra.loginapp.repo;

import com.rmgYantra.loginapp.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PayrollRepo extends JpaRepository<Payroll,Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Payroll p WHERE p.employee.empId = :employeeId")
    void deleteByEmployeeId(String employeeId);
}
