 package qsentinel.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    public String user_id;

    public String email;

    public String email_verified;

    public String username;


    public String name;
    public String family_name;
    public String phone;

    public boolean enabled;

    public SystemAccessLevel system_access_level;

    public String department_id;

    public String area_id;

    public boolean isAuthenticated;
}
