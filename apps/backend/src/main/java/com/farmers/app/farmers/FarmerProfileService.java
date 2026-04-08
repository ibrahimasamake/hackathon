package com.farmers.app.farmers;

import com.farmers.app.common.exception.NotFoundException;
import com.farmers.app.users.User;
import com.farmers.app.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FarmerProfileService {
  private final FarmerProfileRepository farmerProfileRepository;
  private final UserRepository userRepository;

  @Transactional(readOnly = true)
  public FarmerProfileDto getMe(Long userId) {
    FarmerProfile profile =
        farmerProfileRepository
            .findByUserId(userId)
            .orElseThrow(() -> new NotFoundException("Farmer profile not found"));
    return toDto(profile);
  }

  @Transactional(readOnly = true)
  public FarmerProfileDto getById(Long farmerId) {
    FarmerProfile profile =
        farmerProfileRepository
            .findById(farmerId)
            .orElseThrow(() -> new NotFoundException("Farmer profile not found"));
    return toDto(profile);
  }

  @Transactional
  public FarmerProfileDto upsertMyProfile(Long userId, UpdateFarmerProfileRequest request) {
    FarmerProfile profile =
        farmerProfileRepository
            .findByUserId(userId)
            .orElseGet(
                () -> {
                  User user =
                      userRepository
                          .findById(userId)
                          .orElseThrow(() -> new NotFoundException("User not found"));
                  FarmerProfile created = new FarmerProfile();
                  created.setUser(user);
                  return created;
                });
    profile.setFullName(request.fullName());
    profile.setFarmName(request.farmName());
    profile.setPhone(request.phone());
    profile.setTown(request.town());
    profile.setRegion(request.region());
    profile.setBio(request.bio());
    profile.setAvatarUrl(request.avatarUrl());
    return toDto(farmerProfileRepository.save(profile));
  }

  private FarmerProfileDto toDto(FarmerProfile profile) {
    return new FarmerProfileDto(
        profile.getId(),
        profile.getUser().getId(),
        profile.getFullName(),
        profile.getFarmName(),
        profile.getPhone(),
        profile.getTown(),
        profile.getRegion(),
        profile.getBio(),
        profile.getAvatarUrl(),
        profile.isVerified());
  }
}
