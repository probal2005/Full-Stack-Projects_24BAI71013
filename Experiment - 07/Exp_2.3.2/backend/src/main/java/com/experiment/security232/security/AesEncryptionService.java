package com.experiment.security232.security;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class AesEncryptionService {

    private static final String AES = "AES";
    private static final String AES_GCM_NO_PADDING = "AES/GCM/NoPadding";

    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private final String base64Key;

    private SecretKeySpec secretKey;

    public AesEncryptionService(
            @Value("${security.aes-key}") String base64Key
    ) {
        this.base64Key = base64Key;
    }

    @PostConstruct
    public void initialize() {

        byte[] keyBytes;

        try {
            keyBytes = Base64.getDecoder().decode(base64Key);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "security.aes-key must be a valid Base64 value",
                    exception
            );
        }

        if (keyBytes.length != 32) {
            throw new IllegalStateException(
                    "security.aes-key must decode to exactly 32 bytes"
            );
        }

        this.secretKey = new SecretKeySpec(keyBytes, AES);
    }

    public String encrypt(String plaintext) {

        try {
            byte[] iv = new byte[IV_LENGTH];
            SecureRandom secureRandom = new SecureRandom();
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(AES_GCM_NO_PADDING);

            GCMParameterSpec spec =
                    new GCMParameterSpec(TAG_LENGTH, iv);

            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] ciphertext =
                    cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            byte[] combined =
                    new byte[iv.length + ciphertext.length];

            System.arraycopy(
                    iv,
                    0,
                    combined,
                    0,
                    iv.length
            );

            System.arraycopy(
                    ciphertext,
                    0,
                    combined,
                    iv.length,
                    ciphertext.length
            );

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "AES encryption failed",
                    exception
            );
        }
    }

    public String decrypt(String encryptedValue) {

        try {
            byte[] combined =
                    Base64.getDecoder().decode(encryptedValue);

            if (combined.length <= IV_LENGTH) {
                throw new IllegalArgumentException(
                        "Invalid encrypted value"
                );
            }

            byte[] iv = new byte[IV_LENGTH];

            byte[] ciphertext =
                    new byte[combined.length - IV_LENGTH];

            System.arraycopy(
                    combined,
                    0,
                    iv,
                    0,
                    IV_LENGTH
            );

            System.arraycopy(
                    combined,
                    IV_LENGTH,
                    ciphertext,
                    0,
                    ciphertext.length
            );

            Cipher cipher =
                    Cipher.getInstance(AES_GCM_NO_PADDING);

            GCMParameterSpec spec =
                    new GCMParameterSpec(TAG_LENGTH, iv);

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    secretKey,
                    spec
            );

            byte[] plaintext =
                    cipher.doFinal(ciphertext);

            return new String(
                    plaintext,
                    StandardCharsets.UTF_8
            );

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "AES decryption failed",
                    exception
            );
        }
    }
}
