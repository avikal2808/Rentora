package ghost.renotra.controller;

import ghost.renotra.dto.response.UserResponse;
import ghost.renotra.service.UserService;
import ghost.renotra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        ghost.renotra.entity.User rootUser = userService.findByEmail(email);
        UserResponse profile = userService.getUserProfile(rootUser.getId());
        return ResponseEntity.ok(profile);
    }
}
