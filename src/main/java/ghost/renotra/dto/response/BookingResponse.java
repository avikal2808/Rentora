package ghost.renotra.dto.response;

import ghost.renotra.entity.BookingStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingResponse {
    private Long id;
    private ItemResponse item;
    private UserResponse renter;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
}
