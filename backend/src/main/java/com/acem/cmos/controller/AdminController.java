package com.acem.cmos.controller;

import com.acem.cmos.entity.Department;
import com.acem.cmos.entity.Subject;
import com.acem.cmos.entity.Year;
import com.acem.cmos.repository.DepartmentRepository;
import com.acem.cmos.repository.SubjectRepository;
import com.acem.cmos.repository.YearRepository;
import com.acem.cmos.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    YearRepository yearRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    FileStorageService fileStorageService;

    @PostMapping("/years")
    public Year addYear(@RequestBody Year year) {
        return yearRepository.save(year);
    }

    @PostMapping("/departments/{yearId}")
    public Department addDepartment(@PathVariable Long yearId, @RequestBody Department department) {
        Year year = yearRepository.findById(yearId)
                .orElseThrow(() -> new RuntimeException("Year not found"));
        department.setYear(year);
        return departmentRepository.save(department);
    }

    @PostMapping("/subjects/{deptId}")
    public Subject addSubject(@PathVariable Long deptId, @RequestBody Subject subject) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        subject.setDepartment(dept);
        System.out.println("Saving subject: " + subject.getName() + " for semester: " + subject.getSemester());
        return subjectRepository.save(subject);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of("url", "/uploads/" + fileName));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            System.out.println("Updating Department ID: " + id + " to Name: " + name);
            Department dept = departmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            dept.setName(name);
            departmentRepository.save(dept);
            System.out.println("Department updated successfully");
            return ResponseEntity.ok().body(Map.of("message", "Department updated successfully"));
        } catch (Exception e) {
            System.err.println("Error updating department: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/subjects/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String name = (String) payload.get("name");
            String code = (String) payload.get("code");
            Number semNum = (Number) payload.get("semester");
            Integer semester = (semNum != null) ? semNum.intValue() : null;

            System.out.println("Updating Subject ID: " + id + " to Name: " + name);
            System.out.println("Received: Code=" + code + ", Sem=" + semester);

            Subject subject = subjectRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            subject.setName(name);
            subject.setCode(code);
            subject.setSemester(semester);
            subjectRepository.save(subject);
            System.out.println("Subject updated successfully");
            return ResponseEntity.ok().body(Map.of("message", "Subject updated successfully"));
        } catch (Exception e) {
            System.err.println("Error updating subject: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
