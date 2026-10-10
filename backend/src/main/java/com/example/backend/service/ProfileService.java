package com.example.backend.service;

import com.example.backend.model.Profile;
import com.example.backend.model.User;
import com.example.backend.repository.ProfileRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository,
                           UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Profile getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return profileRepository.findByUser(user)
                .orElseGet(() -> {

                    Profile profile = new Profile();
                    profile.setUser(user);

                    return profileRepository.save(profile);
                });
    }

    public Profile updateProfile(String email, Profile updatedProfile) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUser(user)
                .orElseGet(Profile::new);

        profile.setUser(user);
        profile.setBloodGroup(updatedProfile.getBloodGroup());
        profile.setDateOfBirth(updatedProfile.getDateOfBirth());
        profile.setGender(updatedProfile.getGender());
        profile.setAddress(updatedProfile.getAddress());
        profile.setEmergencyContact(
                updatedProfile.getEmergencyContact()
        );

        return profileRepository.save(profile);
    }
}