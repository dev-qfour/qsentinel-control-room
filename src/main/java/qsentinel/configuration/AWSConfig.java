package qsentinel.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.apigateway.AmazonApiGateway;
import com.amazonaws.services.apigateway.AmazonApiGatewayClientBuilder;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource(value = {"classpath:aws.properties"})
public class AWSConfig 
{
	@Value("${amazon.aws.accesskey}")
	private String accessKey;
	@Value("${amazon.aws.secretkey}")
	private String secretkey;


	@Bean
	public AmazonApiGateway amazonApiGateway()
	{


		final BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretkey);


		return AmazonApiGatewayClientBuilder
				.standard()
				.withRegion(Regions.fromName("ap-south-1"))
				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
				.build();


	}



	@Bean
	public AWSCognitoIdentityProvider getAWSCognitoIdentityProvider()
	{
		return AWSCognitoIdentityProviderClientBuilder
				.standard()
				.withCredentials(new AWSStaticCredentialsProvider( new BasicAWSCredentials( accessKey, secretkey ) ))
				.withRegion(Regions.fromName("ap-south-1"))
				.build();


	}


/*    @Bean
	public AmazonS3 getAmazonS3Cient() 
    {
		final BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials("AKIAYW3QO2TSGXIMCMVP", "s7npoF5byvvuGgV2p8SX08VgSd/Oy4FxwFSbFnNv");
		// Get AmazonS3 client and return the s3Client object.
		

		
		return AmazonS3ClientBuilder
				.standard()
				.withRegion(Regions.fromName("ap-south-1"))
				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
				.withForceGlobalBucketAccessEnabled(true)
				.build();
	}

    */



	@Bean
	public AmazonS3 getAmazonS3Cient()
	{
		final BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretkey);
		// Get AmazonS3 client and return the s3Client object.



		return AmazonS3ClientBuilder
				.standard()
				.withRegion(Regions.fromName("ap-south-1"))
				.withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
				.withForceGlobalBucketAccessEnabled(true)
				.build();
	}



	@Bean
	public AmazonSimpleEmailService getAmazonSimpleEmailService() {
		return AmazonSimpleEmailServiceClientBuilder
				.standard()
				.withCredentials(new AWSStaticCredentialsProvider( new BasicAWSCredentials( accessKey, secretkey ) ))
				.withRegion(Regions.fromName("ap-south-1"))
				.build();
	}


	@Bean
	public AmazonSNS amazonSNS() {
		return AmazonSNSClient
				.builder()
				.withCredentials(new AWSStaticCredentialsProvider( new BasicAWSCredentials( accessKey, secretkey ) ))
				.withRegion(Regions.fromName("ap-south-1"))
				.build()
				;

	}
    
    
    

}
