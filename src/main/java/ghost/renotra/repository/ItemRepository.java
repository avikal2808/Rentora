package ghost.renotra.repository;

import ghost.renotra.entity.Item;
import ghost.renotra.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findByOwner(User owner, Pageable pageable);
    List<Item> findByOwner(User owner);
}
