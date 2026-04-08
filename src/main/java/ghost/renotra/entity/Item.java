package ghost.renotra.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "items")
@Data
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(name = "price_per_day", nullable = false)
    private BigDecimal pricePerDay;

    @Column(nullable = false)
    private String location;

    private String category;

    @Lob
    @Column(columnDefinition="TEXT")
    private String imageBase64;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
