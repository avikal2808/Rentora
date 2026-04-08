package ghost.renotra.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal pricePerDay;
    private String location;
    private String category;
    private String imageBase64;
    private UserResponse owner;
}
