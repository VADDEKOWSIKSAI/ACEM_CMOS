package com.acem.cmos.service;

import com.acem.cmos.entity.Material;
import com.acem.cmos.entity.Subject;
import com.acem.cmos.repository.MaterialRepository;
import com.acem.cmos.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {
    @Autowired
    MaterialRepository materialRepository;

    @Autowired
    SubjectRepository subjectRepository;

    public List<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    public List<Material> getMaterialsBySubject(Long subjectId) {
        return materialRepository.findBySubjectId(subjectId);
    }

    public Material addMaterial(Material material, Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        material.setSubject(subject);
        return materialRepository.save(material);
    }

    public Material updateMaterial(Long id, Material materialDetails) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        material.setTitle(materialDetails.getTitle());
        material.setDescription(materialDetails.getDescription());
        material.setPrice(materialDetails.getPrice());
        material.setType(materialDetails.getType());
        material.setIsAvailable(materialDetails.getIsAvailable());
        material.setImageUrl(materialDetails.getImageUrl());

        return materialRepository.save(material);
    }

    public void deleteMaterial(Long id) {
        materialRepository.deleteById(id);
    }
}
