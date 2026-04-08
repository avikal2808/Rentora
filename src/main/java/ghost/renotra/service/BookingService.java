package ghost.renotra.service;

import ghost.renotra.dto.request.BookingRequest;
import ghost.renotra.dto.response.BookingResponse;
import ghost.renotra.entity.Booking;
import ghost.renotra.entity.BookingStatus;
import ghost.renotra.entity.Item;
import ghost.renotra.entity.User;
import ghost.renotra.exception.BookingConflictException;
import ghost.renotra.exception.ResourceNotFoundException;
import ghost.renotra.exception.UnauthorizedException;
import ghost.renotra.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ItemService itemService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public BookingResponse createBooking(BookingRequest request, Long userId) {
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after or equal to start date.");
        }
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past.");
        }

        User renter = userService.findById(userId);
        Item item = itemService.findEntityById(request.getItemId());

        if (item.getOwner().getId().equals(userId)) {
            throw new IllegalArgumentException("You cannot book your own item.");
        }

        // Check for overlapping bookings
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(item.getId(), request.getStartDate(), request.getEndDate());
        if (!overlapping.isEmpty()) {
            throw new BookingConflictException("The item is already booked for the requested dates.");
        }

        Booking booking = new Booking();
        booking.setItem(item);
        booking.setRenter(renter);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return modelMapper.map(saved, BookingResponse.class);
    }

    public Page<BookingResponse> getBookingsByUser(Long userId, Pageable pageable) {
        User renter = userService.findById(userId);
        return bookingRepository.findByRenter(renter, pageable)
                .map(b -> modelMapper.map(b, BookingResponse.class));
    }

    public Page<BookingResponse> getBookingsByItem(Long itemId, Pageable pageable) {
        Item item = itemService.findEntityById(itemId);
        return bookingRepository.findByItem(item, pageable)
                .map(b -> modelMapper.map(b, BookingResponse.class));
    }

    public Page<BookingResponse> getBookingsByItemOwner(Long ownerId, Pageable pageable) {
        User owner = userService.findById(ownerId);
        return bookingRepository.findByItemOwner(owner, pageable)
                .map(b -> modelMapper.map(b, BookingResponse.class));
    }

    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (!booking.getRenter().getId().equals(userId) && !booking.getItem().getOwner().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this booking.");
        }
        return modelMapper.map(booking, BookingResponse.class);
    }

    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (status == BookingStatus.CANCELLED) {
            if (!booking.getRenter().getId().equals(userId) && !booking.getItem().getOwner().getId().equals(userId)) {
                throw new UnauthorizedException("Only the renter or owner can cancel the booking.");
            }
        } else {
            if (!booking.getItem().getOwner().getId().equals(userId)) {
                throw new UnauthorizedException("Only the owner can update status to " + status + ".");
            }
        }

        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        return modelMapper.map(saved, BookingResponse.class);
    }
}
