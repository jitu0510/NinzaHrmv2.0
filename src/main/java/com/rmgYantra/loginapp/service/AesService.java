package com.rmgYantra.loginapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class AesService {

    @Value("${ALGORITHM}")
    private String ALGORITHM;
    @Value("${TRANSFORMATION}")
    private String TRANSFORMATION;
    @Value("${IV}")
    private String IV; // 16 bytes IV
    @Value("${secret-key}")
    private String key;

    public String encrypt(String input) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), ALGORITHM);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(IV.getBytes());
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
        byte[] encrypted = cipher.doFinal(input.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public String decrypt(String input) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), ALGORITHM);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(IV.getBytes());
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(input));
        return new String(decrypted);
    }
}
