package com.acem.cmos.dto;

import com.acem.cmos.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String fullName;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Role role; // Optional, default to STUDENT if null

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
