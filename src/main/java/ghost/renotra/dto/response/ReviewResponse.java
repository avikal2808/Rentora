package ghost.renotra.dto.response;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private UserResponse user;
    private ItemResponse item;
    private Integer rating;
    private String comment;
}
