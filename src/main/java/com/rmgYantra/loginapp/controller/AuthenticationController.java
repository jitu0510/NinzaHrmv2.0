package com.rmgYantra.loginapp.controller;

import java.util.*;

import com.rmgYantra.loginapp.model.Employee;
import com.rmgYantra.loginapp.repo.EmployeeRepo;
import com.rmgYantra.loginapp.security.JwtUtil;
import com.rmgYantra.loginapp.service.KeycloakService;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import com.rmgYantra.loginapp.model.LoginRequest;

import lombok.extern.slf4j.Slf4j;


@RestController
@CrossOrigin(origins = {"*","http://localhost:4201"})
@Slf4j
public class AuthenticationController {

	@Value("${keycloakurl}")
	private String KEYCLOAK_URL;
	@Value("${keycloakclientid}")
	private String CLIENT_ID;
	@Value("${keycloakusername}")
	private String USERNAME;
	@Value("${keycloakpassword}")
	private String PASSWORD;
	@Value("${keycloakrealm}")
	private String REALM;
	@Value("${client-secret}")
	private String clientSecret;

	@Autowired
	private EmployeeRepo employeeRepo;

	@Autowired
	private KeycloakService keycloakService;

	@Autowired
	public JwtUtil jwtUtil;


	@PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest ) {
		log.info("login requested");
		String userName = loginRequest.getUsername();
		String password = loginRequest.getPassword();
		try {

		Optional<Employee> optionalEmployee = employeeRepo.findByUsername(loginRequest.getUsername());
		if(optionalEmployee.isEmpty())
		{
			throw new Exception();
		}
		Employee dbEmployee = optionalEmployee.get();
		HttpClient httpClient = HttpClients.createDefault();
		String accessToken = getAccessToken(httpClient,userName,password);
		JSONObject jsonObject = new JSONObject(accessToken);

		if(jsonObject.has("error")){
			log.error("Invalid Credentials");
			return new ResponseEntity<Object>("Invalid Credentials",HttpStatus.UNAUTHORIZED);
		}

		jsonObject.put("username", loginRequest.getUsername());
		jsonObject.put("role", dbEmployee.getRole());

		return new ResponseEntity(jsonObject.toString(),HttpStatus.OK);
		}catch (Exception e) {
			log.error("Error {}",e.getMessage());
			return new ResponseEntity<Object>("Invalid Credentials",HttpStatus.UNAUTHORIZED);
		}
	}
	@PostMapping("/refresh")
	public ResponseEntity<Object> refreshToken(@RequestBody String refreshToken){
		try {
			String newBearerToken = keycloakService.fetchNewAccessToken(refreshToken);
			return new ResponseEntity(newBearerToken, HttpStatus.OK);
		}catch (Exception e){
			log.error("Error {}",e.getMessage());
			return new ResponseEntity("Invalid or Expired Refresh Token",HttpStatus.BAD_REQUEST);
		}
	}



	private String getAccessToken(HttpClient httpClient,String userName,String password) throws Exception {
		/*HttpPost httpPost = new HttpPost(KEYCLOAK_URL + "/protocol/openid-connect/token");

		List<BasicNameValuePair> params = new ArrayList<>();
		params.add(new BasicNameValuePair("client_id", CLIENT_ID));
		// params.add(new BasicNameValuePair("client_secret", clientSecret));
		params.add(new BasicNameValuePair("username", userName));
		params.add(new BasicNameValuePair("password", password));
		params.add(new BasicNameValuePair("grant_type", "password"));

		httpPost.setEntity(new UrlEncodedFormEntity(params));

		HttpResponse response = httpClient.execute(httpPost);
		HttpEntity entity = response.getEntity();
		String responseBody = EntityUtils.toString(entity);*/
		HttpPost httpPost = new HttpPost(KEYCLOAK_URL + "/protocol/openid-connect/token");

		List<BasicNameValuePair> params = new ArrayList<>();
		params.add(new BasicNameValuePair("client_id", CLIENT_ID));
		params.add(new BasicNameValuePair("client_secret", clientSecret));
		params.add(new BasicNameValuePair("username", userName));
		params.add(new BasicNameValuePair("password", password));
		params.add(new BasicNameValuePair("grant_type", "password"));

		httpPost.setEntity(new UrlEncodedFormEntity(params));

		HttpResponse response = httpClient.execute(httpPost);
		HttpEntity entity = response.getEntity();
		String responseBody = EntityUtils.toString(entity);

		// Assuming response body is in JSON format
		// Parse JSON to extract access token
		// Handle error cases appropriately

		// For simplicity, let's assume the access token is directly returned in the response
		return responseBody;
	}

	private static String extractAccessTokenFromResponse(String responseBody) {
		// Parse JSON response to extract access token
		// Implement according to your JSON parsing library or manually
		JSONObject jsonObject = new JSONObject(responseBody);
		String accessToken = jsonObject.getString("access_token");
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
