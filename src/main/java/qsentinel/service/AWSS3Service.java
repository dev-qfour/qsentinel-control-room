package qsentinel.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import com.google.common.hash.Hashing;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import qsentinel.model.FileInfo;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;


@Service
public class AWSS3Service
{
	private static final Logger LOGGER = LogManager.getLogger(AWSS3Service.class);

	@Autowired
	AmazonS3 amazonS3Client;

	private static final String S3_BUCKET ="qsens-image-processing";

	private static final String CDN_BASE_URL = "https://dvp6l4gtxorcu.cloudfront.net/";



	public void deleteFolder(String keyName)
	{
		LOGGER.info("AWSS3Servises.deleteFolder : S3_BUCKET = " +S3_BUCKET);

		LOGGER.info("AWSS3Servises.deleteFolder : S3_BUCKET = "+amazonS3Client.listObjects(S3_BUCKET, keyName).getObjectSummaries().size() );



		for (S3ObjectSummary file : amazonS3Client.listObjects(S3_BUCKET, keyName).getObjectSummaries())
		{
			LOGGER.info("AWSS3Servises.deleteFolder : file = " +file.getKey());

			amazonS3Client.deleteObject(S3_BUCKET, file.getKey());
		}

//    	amazonS3Client.deleteObject(new DeleteObjectRequest(S3_BUCKET, keyName));

	}

	@Async
	public String uploadImageFile(final MultipartFile multipartFile, FileInfo fileinfo)
	{
		String response = "{\"message\":\"error\"}";
		String message = "error";

		String uploadFullPath = fileinfo.getUpload_full_path();

		String clientIdHash = Hashing.sha256().hashString(fileinfo.getClientId(), StandardCharsets.UTF_8).toString();

		uploadFullPath = uploadFullPath;//clientIdHash+"/"+uploadFullPath;


		LOGGER.info("File upload in progress.");
		try
		{

			LOGGER.info("validateFileType = "+validateFileType(multipartFile));

//			ImageResizeResponse response = imageService.resize(new ImageResizeRequest(multipartFile.getInputStream()));


			if (validateFileType(multipartFile))
			{
				File file = convertMultiPartFileToFile(multipartFile);

				String desktopPath = System.getProperty("user.home") + File.separator +"Desktop";

				LOGGER.info("desktopPath."+desktopPath);

				String outputImagePath = desktopPath+"/uploadImage.png";

				// For storing image in RAM
				BufferedImage image = null;

				image = new BufferedImage(
						160, 160, BufferedImage.TYPE_INT_ARGB);

				// Reading input file
				image = ImageIO.read(file);

				// creates output image
				BufferedImage outputImage = new BufferedImage(160,
						160, image.getType());

				// scales the input image to the output image
				Graphics2D g2d = outputImage.createGraphics();
				g2d.drawImage(image, 0, 0, 160, 160, null);
				g2d.dispose();

				// extracts extension of output file
				String formatName = outputImagePath.substring(outputImagePath
						.lastIndexOf(".") + 1);

				File uploadFile = new File(outputImagePath);

				// writes to output file
				ImageIO.write(outputImage, formatName, uploadFile);

				uploadFileToS3Bucket(S3_BUCKET,uploadFullPath, uploadFile);

				uploadFile.delete();

				LOGGER.info("File upload is completed.");

//				String imageUrl = CDN_BASE_URL +uploadFullPath+ "." + formatName;
				String imageUrl = uploadFullPath;//CDN_BASE_URL +uploadFullPath;

				LOGGER.info("imageurl "+imageUrl);
//				file.delete(); // To remove the file locally created in the project folder.

				message = "success";
				response = "{\"message\":\""+message+"\",\"imageUrl\":\""+imageUrl+"\"}";

			}
			else
			{

				message = "invalid_type";
				response = "{\"message\":\""+message+"\"}";
			}






		} catch (final AmazonServiceException ex)
		{
			LOGGER.info("File upload is failed.");
			LOGGER.error("Error= {} while uploading file.", ex.getMessage());

			message = ex.getMessage();
			response = "{\"message\":\""+message+"\"}";

		} catch (IOException e) {
			e.printStackTrace();
		}


		return response;
	}


	@Async
	public String uploadMappingImageFile(final MultipartFile multipartFile, FileInfo fileinfo) {
		String response = "{\"message\":\"error\"}";
		String message = "error";

		String uploadFullPath = fileinfo.getUpload_full_path();
		String clientIdHash = Hashing.sha256().hashString(fileinfo.getClientId(), StandardCharsets.UTF_8).toString();
		uploadFullPath = uploadFullPath; //clientIdHash+"/"+uploadFullPath;

		LOGGER.info("File upload in progress.");

		try {
			LOGGER.info("validateFileType = " + validateFileType(multipartFile));

			if (validateFileType(multipartFile)) {
				File file = convertMultiPartFileToFile(multipartFile);

				uploadFileToS3Bucket(S3_BUCKET, uploadFullPath, file);

				file.delete();

				LOGGER.info("File upload is completed.");

				String imageUrl = uploadFullPath;

				LOGGER.info("imageurl " + imageUrl);

				message = "success";
				response = "{\"message\":\"" + message + "\",\"imageUrl\":\"" + imageUrl + "\"}";
			} else {
				message = "invalid_type";
				response = "{\"message\":\"" + message + "\"}";
			}
		} catch (final AmazonServiceException ex) {
			LOGGER.info("File upload is failed.");
			LOGGER.error("Error= {} while uploading file.", ex.getMessage());

			message = ex.getMessage();
			response = "{\"message\":\"" + message + "\"}";
		} catch (IOException e) {
			e.printStackTrace();
		}

		return response;
	}



	@Async
	public String uploadMediaFile(final MultipartFile mediaFile, String uploadFullPath)
	{

		String response = "{\"message\":\"error\"}";
		String message = "error";


		LOGGER.info("File upload in progress.");

		try {
			LOGGER.info("validateFileType = " + validateFileType(mediaFile));

			if (validateFileType(mediaFile))
			{
				File file = convertMultiPartFileToFile(mediaFile);

				uploadFileToS3Bucket(S3_BUCKET, uploadFullPath, file);

				file.delete();

				LOGGER.info("File upload is completed.");

				String mediaUrl = uploadFullPath;
				message = "success";
				response = "{\"message\":\"" + message + "\",\"videoUrl\":\"" + mediaUrl + "\"}";


			} else {
				message = "invalid_type";
				response = "{\"message\":\"" + message + "\"}";
			}
		} catch (final AmazonServiceException ex) {
			LOGGER.info("File upload is failed.");
			LOGGER.error("Error= {} while uploading file.", ex.getMessage());

			message = ex.getMessage();
			response = "{\"message\":\"" + message + "\"}";
		} catch (IOException e) {
			e.printStackTrace();
		}

		return response;
	}

	private boolean isVideoFile(MultipartFile file) {
		String contentType = file.getContentType();
		return contentType != null && contentType.startsWith("video");
	}



	private File convertMultiPartFileToFile(final MultipartFile multipartFile) throws IOException
	{

		final File file = new File(multipartFile.getOriginalFilename());

		try (final FileOutputStream outputStream = new FileOutputStream(file))
		{

			outputStream.write(multipartFile.getBytes());

		} catch (final IOException ex)
		{
			LOGGER.error("Error converting the multi-part file to file= ", ex.getMessage());
		}

		return file;
	}


	private void uploadFileToS3Bucket(final String S3_BUCKET, String uploadFullPath, final File file)
	{

		final PutObjectRequest putObjectRequest = new PutObjectRequest(S3_BUCKET, uploadFullPath, file);

		amazonS3Client.putObject(putObjectRequest);
	}






	@Async
	public byte[] downloadFile(String filePath)
	{
		byte[] content = null;

		final S3Object s3Object = amazonS3Client.getObject(S3_BUCKET, filePath);

		final S3ObjectInputStream stream = s3Object.getObjectContent();

		try
		{
			content = IOUtils.toByteArray(stream);

			LOGGER.info("File downloaded successfully.");

			s3Object.close();


		} catch (final IOException ex)
		{
			LOGGER.info("IO Error Message= " + ex.getMessage());
		}
		return content;
	}








	private boolean validateFileType(MultipartFile multipartFile)
	{
		boolean isValid = false;

		LOGGER.info("validateFileType = "+multipartFile.getContentType());





		if (multipartFile.getContentType().equalsIgnoreCase("image/jpeg"))
		{

			isValid =true;

		}

		if (multipartFile.getContentType().equalsIgnoreCase("image/png"))
		{

			isValid =true;

		}
		if (multipartFile.getContentType().equalsIgnoreCase("text/csv"))
		{

			isValid =true;

		}
		if (multipartFile.getContentType().equalsIgnoreCase("video/mp4") || multipartFile.getContentType().equalsIgnoreCase("video/quicktime")) {
			isValid = true;
		}

		if (multipartFile.getContentType().equalsIgnoreCase("video/dav") || multipartFile.getContentType().equalsIgnoreCase("video/quicktime")) {
			isValid = true;
		}


//		return isValid;

		return true;
	}




	public void deleteFile(String filePath) throws Exception
	{
		final DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(S3_BUCKET, filePath);

		amazonS3Client.deleteObject(deleteObjectRequest);

	}

}
