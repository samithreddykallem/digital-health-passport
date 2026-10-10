
package com.example.backend.controller;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.MedicalRecord;
import com.example.backend.service.JwtService;
import com.example.backend.service.MedicalRecordService;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final JwtService jwtService;

    public MedicalRecordController(
            MedicalRecordService medicalRecordService,
            JwtService jwtService) {
        this.medicalRecordService = medicalRecordService;
        this.jwtService = jwtService;
    }

    private String getEmail(String authorization) {
        if (authorization == null
                || !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization token");
        }

        return jwtService.extractEmail(authorization.substring(7));
    }

    @GetMapping
    public ResponseEntity<?> getRecords(
            @RequestHeader("Authorization") String authorization) {
        try {
            return ResponseEntity.ok(
                    medicalRecordService.getRecords(getEmail(authorization)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unable to load medical records");
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addRecord(
            @RequestHeader("Authorization") String authorization,
            @RequestParam("title") String title,
            @RequestParam(value = "diagnosis", required = false) String diagnosis,
            @RequestParam(value = "doctorName", required = false) String doctorName,
            @RequestParam(value = "recordDate", required = false) String recordDate,
            @RequestParam(value = "notes", required = false) String notes,
            @RequestParam("file") MultipartFile file) {
        try {
            MedicalRecord record = new MedicalRecord();
            record.setTitle(title);
            record.setDiagnosis(diagnosis);
            record.setDoctorName(doctorName);
            record.setRecordDate(recordDate);
            record.setNotes(notes);

            MedicalRecord saved = medicalRecordService.addRecord(
                    getEmail(authorization), record, file);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to save medical report");
        }
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<?> viewFile(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        try {
            MedicalRecord record = medicalRecordService.getRecordFile(
                    getEmail(authorization), id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType(record.getContentType()));
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename(record.getFileName())
                            .build());
            headers.setContentLength(record.getFileSize());

            return new ResponseEntity<>(
                    record.getFileData(), headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid authorization token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Medical report not found or inaccessible");
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadFile(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        try {
            MedicalRecord record = medicalRecordService.getRecordFile(
                    getEmail(authorization), id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(
                    MediaType.parseMediaType(record.getContentType()));
            headers.setContentDisposition(
                    ContentDisposition.attachment()
                            .filename(record.getFileName())
                            .build());
            headers.setContentLength(record.getFileSize());

            return new ResponseEntity<>(
                    record.getFileData(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Medical report not found or inaccessible");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long id) {
        try {
            medicalRecordService.deleteRecord(getEmail(authorization), id);
            return ResponseEntity.ok("Medical report deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid authorization token");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Medical report not found or inaccessible");
        }
    }
}
