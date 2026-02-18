package com.acem.cmos.repository;

import com.acem.cmos.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByDepartmentId(Long departmentId);

    @Query("SELECT s FROM Subject s WHERE s.department.id = :departmentId AND s.semester = :semester")
    List<Subject> findByDepartmentIdAndSemester(@Param("departmentId") Long departmentId,
            @Param("semester") Integer semester);
}
