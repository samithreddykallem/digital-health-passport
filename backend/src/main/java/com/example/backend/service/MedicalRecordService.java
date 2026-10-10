
package com.example.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.model.MedicalRecord;
import com.example.backend.model.User;
import com.example.backend.repository.MedicalRecordRepository;
import com.example.backend.repository.UserRepository;

@Service
public class MedicalRecordService {

    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;

    public MedicalRecordService(
            MedicalRecordRepository medicalRecordRepository,
            UserRepository userRepository) {

        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<MedicalRecord> getRecords(String email) {
        User user = findUser(email);
        return medicalRecordRepository.findByUser(user);
    }

    @Transactional
    public MedicalRecord addRecord(
            String email,
            MedicalRecord record,
            MultipartFile file) {

        User user = findUser(email);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select a medical report file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "File size must not exceed 10 MB");
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid file name");
        }

        // Only allow PDF and JPEG extensions.
        String lowerName = originalName.toLowerCase(Locale.ROOT);

        boolean isPdf = lowerName.endsWith(".pdf");
        boolean isJpeg = lowerName.endsWith(".jpg")
                || lowerName.endsWith(".jpeg");

        if (!isPdf && !isJpeg) {
            throw new IllegalArgumentException(
                    "Only PDF, JPG, and JPEG files are allowed");
        }

        try {
            byte[] data = file.getBytes();

            // Check file signatures instead of trusting the extension.
            boolean validPdf = data.length >= 5
                    && data[0] == '%'
                    && data[1] == 'P'
                    && data[2] == 'D'
                    && data[3] == 'F'
                    && data[4] == '-';

            boolean validJpeg = data.length >= 3
                    && (data[0] & 0xFF) == 0xFF
                    && (data[1] & 0xFF) == 0xD8
                    && (data[2] & 0xFF) == 0xFF;

            if ((isPdf && !validPdf) || (isJpeg && !validJpeg)) {
                throw new IllegalArgumentException(
                        "The file contents do not match the file type");
            }

            record.setUser(user);
            record.setFileName(originalName);
            record.setContentType(
                    isPdf ? "application/pdf" : "image/jpeg");
            record.setFileSize((long) data.length);
            record.setFileData(data);

            return medicalRecordRepository.save(record);

        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to read the uploaded file", e);
        }
    }

    @Transactional(readOnly = true)
    public MedicalRecord getRecordFile(String email, Long recordId) {
        User user = findUser(email);

        MedicalRecord record = medicalRecordRepository
                .findById(recordId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical record not found"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You cannot access this medical record");
        }

        return record;
    }

    @Transactional
    public void deleteRecord(String email, Long recordId) {
        User user = findUser(email);

        MedicalRecord record = medicalRecordRepository
                .findById(recordId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical record not found"));

        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You cannot delete this medical record");
        }

        medicalRecordRepository.delete(record);
    }
}
