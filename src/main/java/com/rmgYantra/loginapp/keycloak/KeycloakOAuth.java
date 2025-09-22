package com.rmgYantra.loginapp.keycloak;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
public class KeycloakOAuth {

	
    private static String KEYCLOAK_URL;
	
    private static String CLIENT_ID;
	
    private static String USERNAME;
	
    private static String PASSWORD;
	
    private static String REALM;

    public static void main(String[] args) throws Exception {
    	
    	String basicAuthData = "Basic cm1neWFudHJhOnJtZ3lAOTk5OQ==";

        String[] credentials = extractCredentials(basicAuthData);

        if (credentials != null && credentials.length == 2) {
            String username = credentials[0];
            String password = credentials[1];
           // System.out.println("Username: " + username);
          //  System.out.println("Password: " + password);
        } else {
            log.error("Invalid Basic Authentication data");
        }
        HttpClient httpClient = HttpClients.createDefault();

        // Obtain access token
        String accessToken = getAccessToken(httpClient);

        // Use access token to access protected resource
       // System.out.println("Access Token: " + accessToken);
        // Perform HTTP requests with the access token...
    }

    private static String getAccessToken(HttpClient httpClient) throws Exception {
        HttpPost httpPost = new HttpPost(KEYCLOAK_URL + "/protocol/openid-connect/token");

        List<BasicNameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("client_id", CLIENT_ID));
      //  params.add(new BasicNameValuePair("client_secret", CLIENT_SECRET));
        params.add(new BasicNameValuePair("username", USERNAME));
        params.add(new BasicNameValuePair("password", PASSWORD));
        params.add(new BasicNameValuePair("grant_type", "password"));

        httpPost.setEntity(new UrlEncodedFormEntity(params));

        HttpResponse response = httpClient.execute(httpPost);
        HttpEntity entity = response.getEntity();
        String responseBody = EntityUtils.toString(entity);

        // Assuming response body is in JSON format
        // Parse JSON to extract access token
        // Handle error cases appropriately

        // For simplicity, let's assume the access token is directly returned in the response
        return extractAccessTokenFromResponse(responseBody);
    }

    private static String extractAccessTokenFromResponse(String responseBody) {
        // Parse JSON response to extract access token
        // Implement according to your JSON parsing library or manually
    	JSONObject jsonObject = new JSONObject(responseBody);
        String accessToken = jsonObject.getString("access_token");
    	//System.out.println(accessToken);
        return accessToken;
    }
    private static String[] extractCredentials(String basicAuthData) {
        try {
            String base64Credentials = basicAuthData.substring("Basic ".length()).trim();
            byte[] decodedBytes = Base64.getDecoder().decode(base64Credentials);
            String decodedString = new String(decodedBytes);
            return decodedString.split(":", 2);
        } catch (Exception e) {
            return null;
        }
    }
}