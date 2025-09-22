package com.rmgYantra.loginapp.swagger;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.VendorExtension;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import java.util.Arrays;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

	  public static final Contact DEFAULT_CONTACT = new Contact("", "", "");
	  public static final ApiInfo DEFAULT = new ApiInfo("Ninza HRM Api Documentation", "Api Documentation", "1.0", "urn:tos",
	          DEFAULT_CONTACT, "Apache 2.0", "http://www.apache.org/licenses/LICENSE-2.0", new ArrayList<VendorExtension>());

	  private static final Set<String> DEFAULT_PRODUCES_AND_CONSUMES = new HashSet<String>(Arrays.asList("application/json"));

	//creating bean
	@Bean
	public Docket api()
	{
	//creating constructor of Docket class that accepts parameter DocumentationType
	return new Docket(DocumentationType.SWAGGER_2)
			.select().apis(RequestHandlerSelectors.any()).paths(PathSelectors.any()).build()
			.apiInfo(DEFAULT).produces(DEFAULT_PRODUCES_AND_CONSUMES)
			.consumes(DEFAULT_PRODUCES_AND_CONSUMES);

	}

}
