package com.example.backend.controller;

import com.example.backend.model.Profile;
import com.example.backend.service.JwtService;
import com.example.backend.service.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService,
                             JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public Profile getProfile(
            @RequestHeader("Authorization") String authorization) {

        String token = authorization.substring(7);

        String email = jwtService.extractEmail(token);

        return profileService.getProfile(email);
    }

    @PutMapping
    public Profile updateProfile(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Profile profile) {

        String token = authorization.substring(7);

        String email = jwtService.extractEmail(token);

        return profileService.updateProfile(email, profile);
    }
}