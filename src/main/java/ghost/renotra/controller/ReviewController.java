package ghost.renotra.controller;

import ghost.renotra.dto.request.ReviewRequest;
import ghost.renotra.dto.response.ReviewResponse;
import ghost.renotra.service.ReviewService;
import ghost.renotra.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(reviewService.createReview(request, userId));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(reviewService.getReviewsForItem(itemId));
    }
}
