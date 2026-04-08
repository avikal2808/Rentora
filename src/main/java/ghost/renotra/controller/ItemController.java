package ghost.renotra.controller;

import ghost.renotra.dto.request.ItemRequest;
import ghost.renotra.dto.response.ItemResponse;
import ghost.renotra.service.ItemService;
import ghost.renotra.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(itemService.createItem(request, userId));
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(Pageable pageable) {
        return ResponseEntity.ok(itemService.getAllItems(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ItemResponse>> getItemsByUser(@PathVariable Long userId, Pageable pageable) {
        return ResponseEntity.ok(itemService.getItemsByUser(userId, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(itemService.updateItem(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        itemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }
}
