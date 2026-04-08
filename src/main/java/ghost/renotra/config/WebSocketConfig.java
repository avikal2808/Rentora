package ghost.renotra.config;

import ghost.renotra.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*"); // allows native ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // allows sockjs fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null) {
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        List<String> authorization = accessor.getNativeHeader("Authorization");

                        if (authorization != null && !authorization.isEmpty()) {
                            String authHeader = authorization.get(0);
                            if (authHeader.startsWith("Bearer ")) {
                                String token = authHeader.substring(7);
                                try {
                                    String userEmail = jwtService.extractEmail(token);
                                    
                                    if (userEmail != null) {
                                        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                                        if (jwtService.validateToken(token, userDetails)) {
                                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                    userDetails, null, userDetails.getAuthorities()
                                            );
                                            accessor.setUser(authentication);
                                        }
                                    }
                                } catch (Exception e) {
                                    // Invalid token, do not set user
                                }
                            }
                        }
                    } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                        String destination = accessor.getDestination();
                        java.security.Principal principal = accessor.getUser();
                        
                        // Protect /user/ destinations from being spoofed
                        if (destination != null && destination.startsWith("/user/")) {
                            if (principal == null) {
                                throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
                            }
                            // Verify they are not trying to subscribe to another user's explicit queue explicitly
                            // Legitimate is: /user/queue/messages
                            // Malicious is: /user/malicious@example.com/queue/messages
                            String[] parts = destination.split("/");
                            // parts[0] = "", parts[1] = "user", parts[2] = "queue" or "malicious@example.com"
                            if (parts.length > 2) {
                                String target = parts[2];
                                if (!target.equals("queue") && !target.equals("topic") && !target.equals(principal.getName())) {
                                    throw new org.springframework.security.access.AccessDeniedException("Cannot subscribe to other user's queue");
                                }
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
