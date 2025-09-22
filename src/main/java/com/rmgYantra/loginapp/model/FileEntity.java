package com.rmgYantra.loginapp.model;

import java.sql.Blob;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "file_seq")
    @GenericGenerator(name = "file_seq",strategy = "com.rmgYantra.loginapp.model.StringPrefixedSequesceGenerator",
            parameters = {@org.hibernate.annotations.Parameter(name = StringPrefixedSequesceGenerator.VALUE_PREFIX_PARAMETER, value = "NHR_"),
                    @org.hibernate.annotations.Parameter(name = StringPrefixedSequesceGenerator.NUMBER_FORMAT_PARAMETER, value = "%05d"),
                    @org.hibernate.annotations.Parameter(name = StringPrefixedSequesceGenerator.INCREMENT_PARAM, value = "1")})
    private String id;

    @Column(unique = true)
    private String fileName;

    @Lob
    @Column(length=100000)
    private byte[] fileData;

    private String fileSize;

    private long downloads;

    private String uploadedOn;

}
