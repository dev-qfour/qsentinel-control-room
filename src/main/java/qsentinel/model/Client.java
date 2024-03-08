package qsentinel.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Data
@Document(collection = "new_client")
@CompoundIndex(name = "primary_index", def = "{'id' : 1}")
public class Client
{

    @Id
    @Field("id")
    private String id;


    @Field("client_id")
    private String clientId;


    @Field("client_name")
    private String clientName;


    @Field("address_billing")
    private String addressBilling;


    @Field("zipcode_billing")
    private String zipcodeBilling;



    @Field("address_office")
    private String addressOffice;


    @Field("zipcode_office")
    private String zipcodeOffice;


    @Field("usage_plan_id")
    private String usagePlanId;

    @Field("usage_plan_list")
    private String usagePlanList;

    @Field("api_key_id")
    private String apiKeyId;


    @Field("api_key")
    private String apiKey;



    @Field("api_monthly_quota")
    private int apiMonthlyQuota;


    @Field("location_code")
    private String locationCode;


    @Field("currency_code")
    private String currencyCode;


    @Field("timezone")
    private String timezone;


    @Field("time_created")
    private Time time_created;


    @Field("area_id")
    private String areaId;

    @Field("area_name")
    private String areaName;





}
