package com.rmgYantra.loginapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Properties;

@Service
public class PropertyService {

    @Autowired
    private ResourceLoader resourceLoader;

    public Properties loadProperties() throws IOException {
        Resource resource = resourceLoader.getResource("classpath:application.properties");
        Properties properties = new Properties();
        properties.load(resource.getInputStream());
        return properties;
    }
}
