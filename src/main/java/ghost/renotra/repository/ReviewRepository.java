package ghost.renotra.repository;

import ghost.renotra.entity.Item;
import ghost.renotra.entity.Review;
import ghost.renotra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByItem(Item item);
    boolean existsByUserAndItem(User user, Item item);
}
