package com.rmgYantra.loginapp.service;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@Slf4j
public class KeycloakService {

    @Value("${keycloakusername}")
    private String keycloakUserName;

    @Value("${keycloakpassword}")
    private String keycloakPassword;

    @Value("${keycloakrealm}")
    private String realm;

    @Value("${keycloakclientid}")
    private String clientId;

    @Value("${keycloakclientid}")
    private String client_id;

    @Value("${client-secret}")
    private String clientSecret;

    @Value("${keycloak.auth-server-url}")
    private String keycloakAuthServerUrl;


    private Keycloak getKeycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakAuthServerUrl) // Ensure correct server URL
                .realm("master") // Use master realm for admin login
                .username(keycloakUserName)
                .password(keycloakPassword)
                .clientId(clientId)
                .build();
    }

    public boolean createUserInKeycloakServer(String username,String password){
        if(username.equals("rmgyantra"))
            return true;
        Keycloak keycloak = getKeycloakInstance();

        RealmResource realmResource = keycloak.realm(realm);

        // Create new user
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(username);


        try {
            Response response = realmResource.users().create(user);
            if (response.getStatus() == 201) {
                log.info("User "+user+" created in keycloak");
            } else {
                log.error("Error while creating user "+username+" in keycloak");
                return false;
            }
            response.close();
        } catch (Exception e) {
            log.error("Error: "+e.getMessage());
            return false;
        }

        // Get the user ID
        String userId;
        try {
            userId = realmResource.users().search(username).get(0).getId();
        } catch (Exception e) {
            log.error("Error: "+e.getMessage());
            return false;
        }

        // Set user password
        CredentialRepresentation passwordCredential = new CredentialRepresentation();
        passwordCredential.setTemporary(false);
        passwordCredential.setType(CredentialRepresentation.PASSWORD);
        passwordCredential.setValue(password);

        try {
            realmResource.users().get(userId).resetPassword(passwordCredential);
            log.info("User Password Set Successfully for user: "+username);
        } catch (Exception e) {
            log.error("Error while setting password for user: "+username);
        }
        // Assign role to the user
        try {
            RoleRepresentation userRole = realmResource.roles().get("user").toRepresentation();
            if (userRole == null) {
                log.error("Role 'user' not found in realm");
                return false;
            }
            UserResource userResource = realmResource.users().get(userId);
            userResource.roles().realmLevel().add(Collections.singletonList(userRole));
            log.info("Role 'user' assigned to user: " + username);
        } catch (Exception e) {
            log.error("Error assigning role to user: " + username + ". Error: " + e.getMessage());
            return false;
        }
        return true;
    }

    public boolean deleteUserFromKeycloakServer(String username){
        if(username.equals("rmgyantra"))
            return false;
        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);

        try {
            // Find the user
            List<UserRepresentation> users = realmResource.users().search(username);
            if (users.isEmpty()) {
                log.error("User not found: " + username);
                return false;
            }
            String userId = users.get(0).getId();

            // Delete the user
            realmResource.users().get(userId).remove();
            log.info("User deleted successfully: " + username);
        } catch (Exception e) {
            log.error("Exception occurred while deleting user: " + e.getMessage());
            return false;
        }
        return true;
    }

    public String fetchNewAccessToken(String refreshToken) throws Exception {
       // System.out.println(refreshToken);
      //  System.out.println(client_id);
      //  System.out.println(clientSecret);
        String keycloakURL = keycloakAuthServerUrl+"/realms/"+realm+"/protocol/openid-connect/token";
        Map<Object, Object> data = new HashMap<>();
        data.put("grant_type", "refresh_token");
        data.put("client_id", client_id);
        data.put("client_secret", clientSecret);
        data.put("refresh_token", refreshToken);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(keycloakURL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(buildFormDataFromMap(data))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Extract the access token from the response
            String responseBody = response.body();
            // Parse the JSON response to extract the new access token
            String newAccessToken = extractAccessTokenFromResponse(responseBody);
            return newAccessToken;
        } else {
            throw new RuntimeException("Failed to refresh token: " + response.statusCode() + " - " + response.body());
        }
    }

    private HttpRequest.BodyPublisher buildFormDataFromMap(Map<Object, Object> data) {
        StringJoiner sj = new StringJoiner("&");
        for (Map.Entry<Object, Object> entry : data.entrySet()) {
            sj.add(URLEncoder.encode(entry.getKey().toString(), StandardCharsets.UTF_8) + "=" + URLEncoder.encode(entry.getValue().toString(), StandardCharsets.UTF_8));
        }
        return HttpRequest.BodyPublishers.ofString(sj.toString());
    }

    private String extractAccessTokenFromResponse(String responseBody) {
        // This is a simplified way to parse the JSON response.
        // You can use libraries like Jackson or Gson for a more robust JSON parsing.
        String accessTokenKey = "\"access_token\":\"";
        int startIndex = responseBody.indexOf(accessTokenKey) + accessTokenKey.length();
        int endIndex = responseBody.indexOf("\"", startIndex);
        return responseBody.substring(startIndex, endIndex);
    }
}
