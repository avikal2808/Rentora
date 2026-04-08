package ghost.renotra.repository;

import ghost.renotra.entity.Booking;
import ghost.renotra.entity.BookingStatus;
import ghost.renotra.entity.Item;
import ghost.renotra.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByRenter(User renter, Pageable pageable);
    Page<Booking> findByItem(Item item, Pageable pageable);
    Page<Booking> findByItemOwner(User owner, Pageable pageable);
    List<Booking> findByRenter(User renter);
    List<Booking> findByItem(Item item);

    @Query("SELECT b FROM Booking b WHERE b.item.id = :itemId AND b.status IN ('APPROVED', 'PENDING') " +
           "AND ((b.startDate <= :endDate AND b.endDate >= :startDate))")
    List<Booking> findOverlappingBookings(@Param("itemId") Long itemId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    boolean existsByRenterAndItemAndStatus(User renter, Item item, BookingStatus status);
}
