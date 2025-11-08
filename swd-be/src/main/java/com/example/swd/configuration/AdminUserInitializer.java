package com.example.swd.configuration;

import com.example.swd.entity.Role;
import com.example.swd.entity.User;
import com.example.swd.repository.RoleRepository;
import com.example.swd.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Kiểm tra và tạo Role ADMIN trước nếu chưa có
        Role adminRole = roleRepository.findById("ADMIN").orElseGet(() -> {
            Role newRole = Role.builder()
                    .name("ADMIN")
                    .description("System Administrator")
                    .build();
            log.info(">>> Đang khởi tạo Role: ADMIN");
            return roleRepository.save(newRole);
        });

        // 2. Kiểm tra và tạo User admin nếu chưa có
        if (userRepository.findByUsername("admin").isEmpty()) {
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User adminUser = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin")) // Mã hóa mật khẩu "admin"
                    .firstName("Super")
                    .lastName("Admin")
                    // Các trường khác có thể để null hoặc thêm giá trị mặc định tùy ý
                    .roles(roles)
                    .build();

            userRepository.save(adminUser);
            log.warn(">>> Đã tạo tài khoản ADMIN mặc định: username='admin', password='admin'");
        } else {
            log.info(">>> Tài khoản admin đã tồn tại. Bỏ qua bước khởi tạo.");
        }
    }
}