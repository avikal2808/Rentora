package ghost.renotra.service;

import ghost.renotra.dto.request.ChatMessageRequest;
import ghost.renotra.dto.response.ChatMessageResponse;
import ghost.renotra.entity.ChatMessage;
import ghost.renotra.entity.Item;
import ghost.renotra.entity.User;
import ghost.renotra.exception.ResourceNotFoundException;
import ghost.renotra.repository.ChatMessageRepository;
import ghost.renotra.repository.ItemRepository;
import ghost.renotra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public ChatMessageResponse saveMessage(ChatMessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());

        if (request.getItemId() != null) {
            Item item = itemRepository.findById(request.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
            message.setItem(item);
        }

        ChatMessage saved = chatMessageRepository.save(message);
        return mapToResponse(saved);
    }

    public Page<ChatMessageResponse> getChatHistory(Long userId, Long otherUserId, Pageable pageable) {
        // Just verify users exist
        userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.findById(otherUserId).orElseThrow(() -> new ResourceNotFoundException("Other user not found"));

        return chatMessageRepository.findChatHistory(userId, otherUserId, pageable)
                .map(this::mapToResponse);
    }

    public java.util.List<ChatMessageResponse> getRecentConversations(Long userId) {
        userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        java.util.List<ChatMessage> allUserMessages = chatMessageRepository.findRecentMessagesByUser(userId);
        
        java.util.Map<Long, ChatMessage> latestMessagePerUser = new java.util.LinkedHashMap<>();
        
        for (ChatMessage msg : allUserMessages) {
            // Filter out self-chats (where sender and receiver are the same person)
            if (msg.getSender().getId().equals(msg.getReceiver().getId())) continue;

            Long otherUserId = msg.getSender().getId().equals(userId) ? msg.getReceiver().getId() : msg.getSender().getId();
            if (!latestMessagePerUser.containsKey(otherUserId)) {
                latestMessagePerUser.put(otherUserId, msg);
            }
        }
        
        return latestMessagePerUser.values().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private ChatMessageResponse mapToResponse(ChatMessage message) {
        ChatMessageResponse response = new ChatMessageResponse();
        response.setId(message.getId());
        response.setSenderId(message.getSender().getId());
        response.setSenderName(message.getSender().getName());
        response.setSenderEmail(message.getSender().getEmail());
        response.setReceiverId(message.getReceiver().getId());
        response.setReceiverName(message.getReceiver().getName());
        response.setReceiverEmail(message.getReceiver().getEmail());
        response.setContent(message.getContent());
        response.setTimestamp(message.getTimestamp());
        if (message.getItem() != null) {
            response.setItemId(message.getItem().getId());
        }
        return response;
    }
}
