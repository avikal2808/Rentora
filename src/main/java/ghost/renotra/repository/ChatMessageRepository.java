package ghost.renotra.repository;

import ghost.renotra.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT c FROM ChatMessage c WHERE " +
           "(c.sender.id = :userId AND c.receiver.id = :otherUserId) OR " +
           "(c.sender.id = :otherUserId AND c.receiver.id = :userId) " +
           "ORDER BY c.timestamp DESC")
    Page<ChatMessage> findChatHistory(@Param("userId") Long userId, 
                                      @Param("otherUserId") Long otherUserId, 
                                      Pageable pageable);

    @Query("SELECT c FROM ChatMessage c WHERE c.sender.id = :userId OR c.receiver.id = :userId ORDER BY c.timestamp DESC")
    java.util.List<ChatMessage> findRecentMessagesByUser(@Param("userId") Long userId);
}
