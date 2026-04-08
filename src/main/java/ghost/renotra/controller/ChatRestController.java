package ghost.renotra.controller;

import ghost.renotra.dto.response.ChatMessageResponse;
import ghost.renotra.service.ChatService;
import ghost.renotra.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping("/history")
    public ResponseEntity<Page<ChatMessageResponse>> getChatHistory(
            @RequestParam Long otherUserId,
            Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(chatService.getChatHistory(currentUserId, otherUserId, pageable));
    }

    @GetMapping("/conversations")
    public ResponseEntity<java.util.List<ChatMessageResponse>> getRecentConversations() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(chatService.getRecentConversations(currentUserId));
    }
}
