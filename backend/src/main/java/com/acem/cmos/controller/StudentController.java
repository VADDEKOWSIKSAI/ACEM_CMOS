package com.acem.cmos.controller;

import com.acem.cmos.entity.Department;
import com.acem.cmos.entity.Subject;
import com.acem.cmos.entity.Year;
import com.acem.cmos.repository.DepartmentRepository;
import com.acem.cmos.repository.SubjectRepository;
import com.acem.cmos.repository.YearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
@org.springframework.security.access.prepost.PreAuthorize("permitAll()")
public class StudentController {
    @Autowired
    YearRepository yearRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @GetMapping("/years")
    public List<Year> getAllYears() {
        return yearRepository.findAll();
    }

    @GetMapping("/departments/{yearId}")
    public List<Department> getDepartmentsByYear(@PathVariable Long yearId) {
        return departmentRepository.findByYearId(yearId);
    }

    @GetMapping("/subjects/{departmentId}")
    public List<com.acem.cmos.dto.SubjectDTO> getSubjectsByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(required = false) Integer semester) {
        List<Subject> subjects;
        if (semester != null) {
            subjects = subjectRepository.findByDepartmentIdAndSemester(departmentId, semester);
        } else {
            subjects = subjectRepository.findByDepartmentId(departmentId);
        }

        List<com.acem.cmos.dto.SubjectDTO> result = new java.util.ArrayList<>();
        for (Subject s : subjects) {
            Long deptId = (s.getDepartment() != null) ? s.getDepartment().getId() : null;
            String deptName = (s.getDepartment() != null) ? s.getDepartment().getName() : null;
            result.add(new com.acem.cmos.dto.SubjectDTO(
                    s.getId(),
                    s.getName(),
                    s.getCode(),
                    s.getSemester(),
                    deptId,
                    deptName));
        }
        return result;
    }
}
