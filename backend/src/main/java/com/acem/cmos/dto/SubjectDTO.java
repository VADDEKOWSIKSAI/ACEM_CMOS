package com.acem.cmos.dto;

import lombok.Data;

@Data
public class SubjectDTO {
    private Long id;
    private String name;
    private String code;
    private Integer semester;
    private Long departmentId;
    private String departmentName;

    public SubjectDTO(Long id, String name, String code, Integer semester, Long departmentId, String departmentName) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.semester = semester;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }
}
