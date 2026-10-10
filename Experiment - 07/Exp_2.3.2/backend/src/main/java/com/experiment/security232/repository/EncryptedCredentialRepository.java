package com.experiment.security232.repository;

import com.experiment.security232.entity.EncryptedCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncryptedCredentialRepository
        extends JpaRepository<EncryptedCredential, Long> {

    List<EncryptedCredential> findByUsernameOrderByCreatedAtDesc(String username);
}
