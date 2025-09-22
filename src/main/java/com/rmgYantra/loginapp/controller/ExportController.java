package com.rmgYantra.loginapp.controller;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import com.rmgYantra.loginapp.model.Project;
import com.rmgYantra.loginapp.repo.ExportRepo;

@RestController
@CrossOrigin(origins = "*")
@Slf4j
public class ExportController {

		@Autowired
		private ExportRepo repo;
		
		private final int ROWS_PER_PAGE = 15;

	@GetMapping("/export_xlsx")
	public void exportToExcel(HttpServletResponse response) throws IOException {
		log.info("GET /export_xlsx called");
		List<Project> projects  = repo.findAll();
		// Create workbook and sheet
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("Projects Info");
		XSSFRow row = sheet.createRow(0);
		row.createCell(0).setCellValue("ProjectId");
		row.createCell(1).setCellValue("ProjectName");
		row.createCell(2).setCellValue("No Of Emp");
		row.createCell(3).setCellValue("Project Manager");
		row.createCell(4).setCellValue("Status");
		row.createCell(5).setCellValue("Created On");

		int dataRowIndex = 1;

		for(Project prj : projects) {
			XSSFRow dataRow = sheet.createRow(dataRowIndex);
			dataRow.createCell(0).setCellValue(prj.getProjectId());
			dataRow.createCell(1).setCellValue(prj.getProjectName());
			dataRow.createCell(2).setCellValue(prj.getTeamSize());
			dataRow.createCell(3).setCellValue(prj.getCreatedBy());
			dataRow.createCell(4).setCellValue(prj.getStatus());
			dataRow.createCell(5).setCellValue(prj.getCreatedOn().toString()); // Ensure correct date format
			dataRowIndex++;
		}

		// Create a temporary file to save the workbook
		File tempFile = File.createTempFile("table_data", ".xlsx");

		// Write workbook data to the file
		try (FileOutputStream fileOutputStream = new FileOutputStream(tempFile)) {
			workbook.write(fileOutputStream);
		}

		response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		response.setHeader("Content-Disposition", "attachment; filename=RMG_Projects.xlsx");

		// Stream the file to the response
		try (FileInputStream fileInputStream = new FileInputStream(tempFile)) {
			IOUtils.copy(fileInputStream, response.getOutputStream());
		}

		// Delete the temporary file
		tempFile.delete();

		// Close workbook
		workbook.close();
	}
	
	
	 	@GetMapping("/export_csv")
	 	public void exportToCsv(HttpServletResponse response) throws IOException {
			log.info("GET /export_csv called");
	        // Fetch data from the database
	        List<Project> data = repo.findAll();

	        // Set response headers
	        response.setContentType("text/csv");
	        response.setHeader("Content-Disposition", "attachment; filename=RMG_Projects.csv");

	        // Write CSV content to the response
	        try (PrintWriter writer = response.getWriter()) {
	            // Write CSV header
	            writer.println("ProjectId,Project Name,No Of Emp,Project Manager,Status,Created On"); // Replace with your actual column names

	            // Write data rows
	            for (Project entity : data) {
	                writer.println(
	                        entity.getProjectId() + "," +
	                        entity.getProjectName() + "," +
	                        entity.getTeamSize() + "," +
	                        entity.getCreatedBy() + "," +
	                        entity.getStatus() + "," +
	                        entity.getCreatedOn()
	                        // Add more columns as needed
	                );
	            }
	        }
	    }



	@GetMapping("/export_docx")
	public void exportToWord(HttpServletResponse response) throws IOException {
		log.info("GET /export_docx called");
		// Fetch data from the database
		List<Project> data = repo.findAll();

		// Set response headers
		response.setContentType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
		response.setHeader("Content-Disposition", "attachment; filename=RMG_Projects.docx");

		// Create Word document
		try (XWPFDocument document = new XWPFDocument()) {
			// Create table with 1 row for header
			XWPFTable table = document.createTable(data.size() + 1, 6);

			// Set header row
			setTableHeader(table.getRow(0));

			// Fill table with data
			for (int i = 0; i < data.size(); i++) {
				setTableRow(table.getRow(i + 1), data.get(i));
			}

			// Save Word document to response stream
			document.write(response.getOutputStream());
		}
	}

	private void setTableHeader(XWPFTableRow headerRow) {
		headerRow.getCell(0).setText("ProjectId");
		headerRow.getCell(1).setText("Project Name");
		headerRow.getCell(2).setText("No Of Emp");
		headerRow.getCell(3).setText("Project Manager");
		headerRow.getCell(4).setText("Status");
		headerRow.getCell(5).setText("Created On");
	}

	private void setTableRow(XWPFTableRow tableRow, Project entity) {
		tableRow.getCell(0).setText(entity.getProjectId());
		tableRow.getCell(1).setText(entity.getProjectName());
		tableRow.getCell(2).setText(String.valueOf(entity.getTeamSize()));
		tableRow.getCell(3).setText(entity.getCreatedBy());
		tableRow.getCell(4).setText(entity.getStatus());
		tableRow.getCell(5).setText(entity.getCreatedOn().toString());
	}

	@GetMapping("/export_pdf")
	public void exportToPdf(HttpServletResponse response) throws Exception {
		log.info("GET /export_pdf called");
		// Fetch data from the database
		List<Project> data = repo.findAll();
		// Set response headers
		response.setContentType("application/pdf");
		response.setHeader("Content-Disposition", "attachment; filename=RMG_Projects.pdf");

		// Create PDF document
		try (PDDocument document = new PDDocument()) {
			addPages(document, data);
			// Save PDF to response stream
			try (BufferedOutputStream bos = new BufferedOutputStream(response.getOutputStream())) {
				document.save(bos);
			}
		}
	}

	private void addPages(PDDocument document, List<Project> data) throws Exception {
		final int ROWS_PER_PAGE = 25; // Adjust the number of rows per page as needed
		for (int i = 0; i < data.size(); i += ROWS_PER_PAGE) {
			List<Project> pageData = data.subList(i, Math.min(i + ROWS_PER_PAGE, data.size()));
			addPage(document, pageData);
		}
	}

	private void addPage(PDDocument document, List<Project> data) throws IOException, InterruptedException {
		PDPage page = new PDPage();
		document.addPage(page);

		// Create content stream
		try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
			contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
			float margin = 50;
			float yStart = page.getMediaBox().getHeight() - margin;
			float tableWidth = page.getMediaBox().getWidth() - 2 * margin;
			float yPosition = yStart;
			float tableHeight = 20f; // Adjust as needed for header height
			float bottomMargin = 50;
			float rowHeight = 20f; // Adjust as needed for row height

			// Column widths
			float[] colWidths = {100, 100, 70, 100, 70, 72}; // Adjust column widths as needed

			// Header
			drawTableHeader(contentStream, margin, yPosition, tableWidth, tableHeight, colWidths);

			// Rows
			yPosition -= tableHeight;
			contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 8);
			for (Project entity : data) {
				drawTableRow(contentStream, margin, yPosition, tableWidth, rowHeight, entity, colWidths);
				yPosition -= rowHeight;
				if (yPosition <= bottomMargin) {
					// Break and handle new page outside this method
					break;
				}
			}
		}
	}


	private void drawTableHeader(PDPageContentStream contentStream, float x, float y, float tableWidth, float height, float[] colWidths) throws IOException {
		String[] headers = {"Project Id", "Project Name", "No Of Emp", "Project Manager", "Status", "Created On"};

		contentStream.setLineWidth(1f);

		float nextX = x;

		for (int i = 0; i < headers.length; i++) {
			// Draw header cell rectangle
			contentStream.addRect(nextX, y - height, colWidths[i], height);
			contentStream.stroke();

			// Draw header text
			contentStream.beginText();
			contentStream.newLineAtOffset(nextX + 2, y - 15);
			contentStream.showText(headers[i]);
			contentStream.endText();

			nextX += colWidths[i];
		}

		// Draw bottom horizontal line of header
		contentStream.moveTo(x, y - height);
		contentStream.lineTo(x + tableWidth, y - height);
		contentStream.stroke();
	}

	private void drawTableRow(PDPageContentStream contentStream, float x, float y, float tableWidth, float height, Project entity, float[] colWidths) throws IOException, InterruptedException {
		String[] data = {
				entity.getProjectId(),
				entity.getProjectName(),
				String.valueOf(entity.getTeamSize()),
				entity.getCreatedBy(),
				entity.getStatus(),
				entity.getCreatedOn().toString()
		};

		contentStream.setLineWidth(0.5f);

		float nextX = x;

		for (int i = 0; i < data.length; i++) {
			// Draw row cell rectangle
			contentStream.addRect(nextX, y - height, colWidths[i], height);
			contentStream.stroke();

			// Draw row text
			contentStream.beginText();
			contentStream.newLineAtOffset(nextX + 2, y - 15);
			contentStream.showText(data[i]);
			contentStream.endText();

			nextX += colWidths[i];
		}

		// Draw bottom horizontal line of row
		contentStream.moveTo(x, y - height);
		contentStream.lineTo(x + tableWidth, y - height);
		contentStream.stroke();
	}

//	         @GetMapping("/export_png")
//	         public ResponseEntity<byte[]> downloadImage() throws IOException {
//	             // Load the image from the classpath
//	             ClassPathResource resource = new ClassPathResource("static/images/ACOE3.png");
//
//	             // Copy the image to a temporary file
//	             Path tempFile = Files.createTempFile("download", ".png");
//	             Files.copy(resource.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
//
//	             // Set headers for the response
//	             HttpHeaders headers = new HttpHeaders();
//	             headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//	             headers.setContentDispositionFormData("attachment", "sample.png");
//
//	             // Read the content of the temporary file into a byte array
//	             byte[] fileContent = Files.readAllBytes(tempFile);
//
//	             // Return the response entity with the image content and headers
//	             return ResponseEntity.ok()
//	                     .headers(headers)
//	                     .body(fileContent);
//	         }

}
