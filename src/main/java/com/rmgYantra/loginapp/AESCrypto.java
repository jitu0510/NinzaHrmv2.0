package com.rmgYantra.loginapp;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Slf4j
public class AESCrypto {

    private static final Logger logger = Logger.getLogger(AESCrypto.class.getName());

    private static Keycloak getKeycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl("http://localhost:8180/auth") // Ensure correct server URL
                .realm("master") // Use master realm for admin login
                .username("admin")
                .password("admin")
                .clientId("admin-cli")
                .build();
    }

    public static void main(String[] args) {
        Keycloak keycloak = getKeycloakInstance();
        logger.info("Keycloak instance closed: " + keycloak.isClosed());
        RealmResource realmResource = keycloak.realm("ninza");

        // Create new user
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername("thane");
        user.setEmail("thane1234@gmail.com");

        try {
            Response response = realmResource.users().create(user);
            if (response.getStatus() == 201) {
                logger.info("User created successfully");
            } else {
                logger.severe("Failed to create user: " + response.getStatusInfo().toString());
                return;
            }
            response.close();
        } catch (Exception e) {
            log.error("Error {}",e.getMessage());
            logger.severe("Exception occurred while creating user: " + e.getMessage());
            return;
        }

        // Get the user ID
        String userId;
        try {
            userId = realmResource.users().search("thane").get(0).getId();
            logger.info("User ID: " + userId);
        } catch (Exception e) {
            logger.severe("Exception occurred while searching for user: " + e.getMessage());
            return;
        }

        // Set user password
        CredentialRepresentation passwordCredential = new CredentialRepresentation();
        passwordCredential.setTemporary(false);
        passwordCredential.setType(CredentialRepresentation.PASSWORD);
        passwordCredential.setValue("thane");

        try {
            realmResource.users().get(userId).resetPassword(passwordCredential);
            logger.info("Password reset successfully for user ID: " + userId);
        } catch (Exception e) {
            logger.severe("Exception occurred while resetting password: " + e.getMessage());
        }
    }
}
