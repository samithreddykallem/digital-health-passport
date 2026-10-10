
package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Prescription;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.PrescriptionService;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public PrescriptionController(
            PrescriptionService prescriptionService,
            JwtService jwtService,
            UserRepository userRepository) {
        this.prescriptionService = prescriptionService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    private User getUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid token");
        }

        String token = authorizationHeader.substring(7);
        String email = jwtService.extractEmail(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));
    }

    @GetMapping
    public ResponseEntity<?> getPrescriptions(
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            User user = getUserFromToken(authorizationHeader);
            List<Prescription> prescriptions =
                    prescriptionService.getPrescriptions(user);

            return ResponseEntity.ok(prescriptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unable to authenticate user");
        }
    }

    @PostMapping
    public ResponseEntity<?> addPrescription(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Prescription prescription) {
        try {
            User user = getUserFromToken(authorizationHeader);
            Prescription saved =
                    prescriptionService.addPrescription(prescription, user);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Unable to add prescription");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long id) {
        try {
            User user = getUserFromToken(authorizationHeader);
            boolean deleted =
                    prescriptionService.deletePrescription(id, user);

            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Prescription not found");
            }

            return ResponseEntity.ok("Prescription deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unable to authenticate user");
        }
    }
}
