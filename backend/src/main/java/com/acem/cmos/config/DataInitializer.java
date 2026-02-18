package com.acem.cmos.config;

import com.acem.cmos.entity.Role;
import com.acem.cmos.entity.User;
import com.acem.cmos.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin exists, if not create, if yes update to ensure access
            User admin = userRepository.findByEmail("admin@acem.edu")
                    .orElse(new User());

            admin.setFullName("System Administrator");
            admin.setEmail("admin@acem.edu");
            admin.setPassword(passwordEncoder.encode("admin123")); // Enforce default password
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);
            System.out.println("Default Admin User Ensured: admin@acem.edu / admin123");
        };
    }
}
