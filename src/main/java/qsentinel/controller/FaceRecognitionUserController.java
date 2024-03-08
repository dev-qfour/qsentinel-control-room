package qsentinel.controller;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value ="/user/face_recognition_user")
public class FaceRecognitionUserController {


    private static final Logger LOGGER = LogManager.getLogger(FaceRecognitionUserController.class);

    @Autowired
    AmazonS3 amazonS3Client;



    @GetMapping(value = "/file/**", produces = { MediaType.APPLICATION_OCTET_STREAM_VALUE })
    public ResponseEntity<StreamingResponseBody> getObject(HttpServletRequest request) {
        try {

            String uri = request.getRequestURI();
            LOGGER.info("uri = "+uri);
            String uriParts[] = uri.split("/");
            String bucket = uriParts[4];
            String key = uriParts[uriParts.length-8]+"/"+uriParts[uriParts.length-7]+"/"+uriParts[uriParts.length-6]+"/"+uriParts[uriParts.length-5]+"/"+uriParts[uriParts.length-4]+"/"+uriParts[uriParts.length-3]+"/"+uriParts[uriParts.length-2]+"/"+uriParts[uriParts.length-1];
            LOGGER.info("uriParts[]  = "+uriParts.length);
            LOGGER.info("bucket = "+bucket);
            LOGGER.info("key = "+key);


//            bucket = "qsens-image-processing";
//            key = "client_demo/client-demo-cyclops-01/client_demo-client-demo-cyclops-01-01-11-2023 19-40-58.mp4";


            S3Object object = amazonS3Client.getObject(bucket, key);
            S3ObjectInputStream finalObject = object.getObjectContent();

            final StreamingResponseBody body = outputStream -> {
                int numberOfBytesToWrite = 0;
                byte[] data = new byte[1024];
                while ((numberOfBytesToWrite = finalObject.read(data, 0, data.length)) != -1) {
                    outputStream.write(data, 0, numberOfBytesToWrite);
                }
                finalObject.close();
            };
            return new ResponseEntity<StreamingResponseBody>(body, HttpStatus.OK);

        } catch (Exception e) {
            System.err.println("Error "+ e.getMessage());
            return new ResponseEntity<StreamingResponseBody>(HttpStatus.BAD_REQUEST);
        }


    }



/*
    @GetMapping(value = "/file/**", produces = "image/jpeg")
    public ResponseEntity<StreamingResponseBody> getObject(HttpServletRequest request) {
        try {
            String uri = request.getRequestURI();
            LOGGER.info("Requested URI: " + uri);

            String[] uriParts = uri.split("/");
            String bucket = uriParts[4];
            String key = String.join("/", Arrays.copyOfRange(uriParts, uriParts.length - 3, uriParts.length));

            LOGGER.info("Bucket: " + bucket);
            LOGGER.info("Key: " + key);

            S3Object object = amazonS3Client.getObject(bucket, key);
            S3ObjectInputStream objectInputStream = object.getObjectContent();

            StreamingResponseBody body = outputStream -> {
                try {
                    byte[] data = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = objectInputStream.read(data)) != -1) {
                        outputStream.write(data, 0, bytesRead);
                    }
                } finally {
                    objectInputStream.close();
                }
            };

            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (AmazonS3Exception e) {
            if ("NoSuchBucket".equals(e.getErrorCode())) {
                LOGGER.error("Bucket not found: " + e.getMessage());
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                LOGGER.error("Amazon S3 Exception: " + e.getMessage());
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            LOGGER.error("Error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
*/




}
