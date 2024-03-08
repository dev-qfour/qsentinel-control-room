package qsentinel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
//@NoArgsConstructor
public class CognitoUser
{

	public String sub;

	public String client_id;

	public String email;
	public String email_verified; 
	
	public String username;

	public String name;
	public String family_name; 

	public boolean enabled;

	public String access_level;

	public boolean isAuthenticated = false;

	public CognitoUser()
	{
		isAuthenticated = false;

	}




	public String user_id;

	public SystemAccessLevel system_access_level;

	public String department_id;

	public String area_id;

}
