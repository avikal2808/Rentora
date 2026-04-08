package ghost.renotra.service;

import ghost.renotra.dto.request.ReviewRequest;
import ghost.renotra.dto.response.ReviewResponse;
import ghost.renotra.entity.Item;
import ghost.renotra.entity.Review;
import ghost.renotra.entity.User;
import ghost.renotra.entity.BookingStatus;
import ghost.renotra.exception.ResourceNotFoundException;
import ghost.renotra.repository.BookingRepository;
import ghost.renotra.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ItemService itemService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public ReviewResponse createReview(ReviewRequest request, Long userId) {
        User user = userService.findById(userId);
        Item item = itemService.findEntityById(request.getItemId());

        boolean hasCompleted = bookingRepository.existsByRenterAndItemAndStatus(user, item, BookingStatus.COMPLETED);
        if (!hasCompleted) {
            throw new IllegalArgumentException("You can only review items you have successfully rented.");
        }

        if (reviewRepository.existsByUserAndItem(user, item)) {
            throw new IllegalArgumentException("You have already reviewed this item.");
        }

        Review review = modelMapper.map(request, Review.class);
        review.setUser(user);
        review.setItem(item);
        review.setRating(request.getRating());

        Review saved = reviewRepository.save(review);
        return modelMapper.map(saved, ReviewResponse.class);
    }

    public List<ReviewResponse> getReviewsForItem(Long itemId) {
        Item item = itemService.findEntityById(itemId);
        return reviewRepository.findByItem(item).stream()
                .map(review -> modelMapper.map(review, ReviewResponse.class))
                .collect(Collectors.toList());
    }
}
