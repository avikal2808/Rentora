package ghost.renotra.controller;

import ghost.renotra.dto.request.ChatMessageRequest;
import ghost.renotra.dto.response.ChatMessageResponse;
import ghost.renotra.entity.User;
import ghost.renotra.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    
    // Limits per user memory map
    private final Map<Long, Bucket> userBuckets = new ConcurrentHashMap<>();

    private Bucket createWebSocketBucket() {
        // Limit: 10 messages per 10 seconds per user
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(10)));
        return Bucket.builder().addLimit(limit).build();
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest chatMessageRequest, SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getUser() == null) {
            return;
        }

        User user = (User) ((UsernamePasswordAuthenticationToken) headerAccessor.getUser()).getPrincipal();
        Long senderId = user.getId();

        // Enforce WebSocket Message Rate Limits Globally
        Bucket bucket = userBuckets.computeIfAbsent(senderId, k -> createWebSocketBucket());
        if (!bucket.tryConsume(1)) {
            // Drop message gracefully to prevent DB flooding
            return;
        }

        ChatMessageResponse savedMessage = chatService.saveMessage(chatMessageRequest, senderId);

        // Broadcast to receiver 
        messagingTemplate.convertAndSendToUser(
                savedMessage.getReceiverEmail(), 
                "/queue/messages",
                savedMessage
        );

        // Broadcast back to sender
        messagingTemplate.convertAndSendToUser(
                savedMessage.getSenderEmail(),
                "/queue/messages",
                savedMessage
        );
    }
}
