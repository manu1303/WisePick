package com.wisepick.company.repository;

import com.wisepick.company.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPreferenceRepository
        extends JpaRepository<UserPreference, String> {

    Optional<UserPreference> findByOwnerUid(String ownerUid);
}