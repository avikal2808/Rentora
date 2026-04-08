package ghost.renotra.controller;

import ghost.renotra.dto.request.BookingRequest;
import ghost.renotra.dto.response.BookingResponse;
import ghost.renotra.entity.BookingStatus;
import ghost.renotra.service.BookingService;
import ghost.renotra.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookingService.createBooking(request, userId));
    }

    @GetMapping("/user")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId, pageable));
    }

    @GetMapping("/owner")
    public ResponseEntity<Page<BookingResponse>> getOwnerBookings(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookingService.getBookingsByItemOwner(userId, pageable));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<Page<BookingResponse>> getBookingsForItem(@PathVariable Long itemId, Pageable pageable) {
        return ResponseEntity.ok(bookingService.getBookingsByItem(itemId, pageable));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long bookingId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookingService.getBookingById(bookingId, userId));
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long bookingId,
                                                               @RequestParam BookingStatus status) {
        // Ideally, we should check permissions (only owner of the item can update).
        // For simplicity, pass current user ID; you can extend logic.
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status, userId));
    }
}
