package ghost.renotra.service;

import ghost.renotra.dto.request.ItemRequest;
import ghost.renotra.dto.response.ItemResponse;
import ghost.renotra.entity.Item;
import ghost.renotra.entity.User;
import ghost.renotra.exception.ResourceNotFoundException;
import ghost.renotra.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public ItemResponse createItem(ItemRequest request, Long ownerId) {
        User owner = userService.findById(ownerId);
        Item item = modelMapper.map(request, Item.class);
        item.setOwner(owner);
        Item saved = itemRepository.save(item);
        return modelMapper.map(saved, ItemResponse.class);
    }

    public Page<ItemResponse> getAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable)
                .map(item -> modelMapper.map(item, ItemResponse.class));
    }

    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        return modelMapper.map(item, ItemResponse.class);
    }

    public Page<ItemResponse> getItemsByUser(Long userId, Pageable pageable) {
        User user = userService.findById(userId);
        return itemRepository.findByOwner(user, pageable)
                .map(item -> modelMapper.map(item, ItemResponse.class));
    }

    public Item findEntityById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }

    public ItemResponse updateItem(Long id, ItemRequest request, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getOwner().getId().equals(userId)) {
            throw new ghost.renotra.exception.UnauthorizedException("Only the owner can update this item.");
        }
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setPricePerDay(request.getPricePerDay());
        item.setLocation(request.getLocation());
        item.setCategory(request.getCategory());
        
        Item saved = itemRepository.save(item);
        return modelMapper.map(saved, ItemResponse.class);
    }

    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!item.getOwner().getId().equals(userId)) {
            throw new ghost.renotra.exception.UnauthorizedException("Only the owner can delete this item.");
        }
        itemRepository.delete(item);
    }
}
