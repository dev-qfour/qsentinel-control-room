package qsentinel.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import qsentinel.model.FileInfo;
import qsentinel.service.AWSS3Service;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/user")
public class AWSS3Controller
{

	private static final Logger LOGGER = LogManager.getLogger(AWSS3Controller.class);

	@Autowired(required = true)
	AWSS3Service awsS3Service;

	@ResponseBody
	@RequestMapping(value ="/image/file/upload",
			method = RequestMethod.POST,
			consumes = {"multipart/form-data"},
			produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
	)
	public String imageFileUpload (@RequestPart(value= "file")   MultipartFile multipartFile, @RequestPart(value="fileInfo") FileInfo fileInfo){

		String response = "{\"message\":\"error\"}";

		LOGGER.info("fileInfo = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(fileInfo, FileInfo.class) );

		LOGGER.info("multipartFile = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(multipartFile, MultipartFile.class) );



		try
		{


//    		String message = awsS3Service.uploadFile(multipartFile, fileInfo.getUpload_full_path());

			String message = awsS3Service.uploadImageFile(multipartFile, fileInfo);

			Gson gson = new GsonBuilder().create();

			response = message;



		} catch (Exception e)
		{
			e.printStackTrace();

			LOGGER.error(e.getMessage());
			LOGGER.error(e.getCause());


			response = "{\"message\":\"error\"}";


		}


		return response;

	}


	@ResponseBody
	@RequestMapping(value ="/image/mapping/file/upload",
			method = RequestMethod.POST,
			consumes = {"multipart/form-data"},
			produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
	)
	public String imageMappingFileUpload (@RequestPart(value= "file")   MultipartFile multipartFile, @RequestPart(value="fileInfo") FileInfo fileInfo){

		String response = "{\"message\":\"error\"}";

		LOGGER.info("fileInfo = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(fileInfo, FileInfo.class) );

		LOGGER.info("multipartFile = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(multipartFile, MultipartFile.class) );



		try
		{


//    		String message = awsS3Service.uploadFile(multipartFile, fileInfo.getUpload_full_path());

			String message = awsS3Service.uploadMappingImageFile(multipartFile, fileInfo);

			Gson gson = new GsonBuilder().create();

			response = message;



		} catch (Exception e)
		{
			e.printStackTrace();

			LOGGER.error(e.getMessage());
			LOGGER.error(e.getCause());


			response = "{\"message\":\"error\"}";


		}


		return response;

	}



	@ResponseBody
	@RequestMapping(value ="/image/file/delete",
			method = RequestMethod.POST,
			consumes = { MediaType.APPLICATION_JSON_VALUE, "application/json" }	,
			produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
	)
	public String fileDelete (@RequestBody FileInfo fileInfo)
	{
		String response = "{\"message\":\"error\"}";

		LOGGER.info("fileInfo = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(fileInfo, FileInfo.class) );

		try
		{

			awsS3Service.deleteFile(fileInfo.getUpload_full_path());




			Gson gson = new GsonBuilder().create();

			response = "{\"message\":\"success\"}";



		} catch (Exception e)
		{
			e.printStackTrace();

			LOGGER.error(e.getMessage());
			LOGGER.error(e.getCause());


			response = "{\"message\":\"error\"}";


		}


		return response;

	}


	@ResponseBody
	@RequestMapping(value ="/video/file/upload",
			method = RequestMethod.POST,
			consumes = {"multipart/form-data"},
			produces = { MediaType.APPLICATION_JSON_VALUE, "application/json" }
	)
	public String videoFileUpload (HttpServletRequest request, @RequestPart(value= "file") MultipartFile multipartFile){

		String response = "{\"message\":\"error\"}";



		LOGGER.info("multipartFile = " +
				(new GsonBuilder().setPrettyPrinting().create())
						.toJson(multipartFile, MultipartFile.class) );



		LOGGER.info("multipartFile = " +multipartFile.getOriginalFilename());

		String uploadFullPath = request.getParameter("upload_file_path");


		LOGGER.info("request = " +request.getParameter("upload_file_path"));


		try
		{

			String message = "NOT Completed";


//			message = awsS3Service.uploadMediaFile(multipartFile, uploadFullPath);

			Gson gson = new GsonBuilder().create();

			response = message;



		} catch (Exception e)
		{
			e.printStackTrace();

			LOGGER.error(e.getMessage());
			LOGGER.error(e.getCause());


			response = "{\"message\":\"error\"}";


		}


		return response;

	}



	@ResponseBody
	@RequestMapping(value = "/video/file/download",
			method = RequestMethod.POST,
			produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ByteArrayResource> downloadVideo(@RequestParam(value = "f")  String path ) {
		String response = "{\"message\":\"error\"}";

		LOGGER.info("uploadFullFilePath = " + path);

		byte[] data = null;

		ByteArrayResource resource = null;

		try
		{
			data = awsS3Service.downloadFile(path);

			resource = new ByteArrayResource(data);

			response = "{\"message\":\"success\"}";

		} catch (Exception e)
		{
			e.printStackTrace();

			LOGGER.error(e.getMessage());
			LOGGER.error(e.getCause());


			response = "{\"message\":\"error\"}";

		}

		return ResponseEntity
				.ok()
				.contentLength(data.length)
				.header("Content-type", "application/octet-stream")
                .header("Content-disposition", "attachment; filename=\"" + "test" + "\"")
				.body(resource);

	}

}










