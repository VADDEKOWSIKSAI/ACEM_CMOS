package com.acem.cmos.controller;

import com.acem.cmos.entity.Material;
import com.acem.cmos.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/materials")
public class MaterialController {
    @Autowired
    MaterialService materialService;

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.getAllMaterials();
    }

    @GetMapping("/subject/{subjectId}")
    public List<Material> getMaterialsBySubject(@PathVariable Long subjectId) {
        return materialService.getMaterialsBySubject(subjectId);
    }

    @PostMapping("/{subjectId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Material addMaterial(@RequestBody Material material, @PathVariable Long subjectId) {
        return materialService.addMaterial(material, subjectId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Material updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        return materialService.updateMaterial(id, material);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
    }
}
