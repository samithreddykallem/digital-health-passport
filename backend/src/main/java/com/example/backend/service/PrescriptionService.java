
package com.example.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.model.Prescription;
import com.example.backend.model.User;
import com.example.backend.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<Prescription> getPrescriptions(User user) {
        return prescriptionRepository.findByUser(user);
    }

    public Prescription addPrescription(
            Prescription prescription, User user) {

        prescription.setUser(user);

        return prescriptionRepository.save(prescription);
    }

    public boolean deletePrescription(Long id, User user) {
        return prescriptionRepository.findById(id)
                .filter(prescription ->
                        prescription.getUser().getId()
                                .equals(user.getId()))
                .map(prescription -> {
                    prescriptionRepository.delete(prescription);
                    return true;
                })
                .orElse(false);
    }
}