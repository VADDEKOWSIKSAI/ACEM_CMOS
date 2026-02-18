package com.acem.cmos.repository;

import com.acem.cmos.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByYearId(Long yearId);
}
