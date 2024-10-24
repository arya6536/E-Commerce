package com.practice.ecom.services.customer.cart;

import com.practice.ecom.dto.AddProductInCartDto;
import com.practice.ecom.dto.CartItemsDto;
import com.practice.ecom.dto.OrderDto;
import com.practice.ecom.dto.PlaceOrderDto;
import com.practice.ecom.entity.CartItems;
import com.practice.ecom.entity.Order;
import com.practice.ecom.entity.Product;
import com.practice.ecom.entity.User;
import com.practice.ecom.enums.OrderStatus;
import com.practice.ecom.repository.CartItemsRepository;
import com.practice.ecom.repository.OrderRepository;
import com.practice.ecom.repository.ProductRepository;
import com.practice.ecom.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemsRepository cartItemsRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public ResponseEntity<?> addProductToCart(AddProductInCartDto addProductInCartDto) {
        // Check if the quantity is null or invalid
        if (addProductInCartDto.getQuantity() == null || addProductInCartDto.getQuantity() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Quantity must be greater than zero");
        }

        // Logging DTO information
        System.out.println("Attempting to add product to cart with details:");
        System.out.println("User ID: " + addProductInCartDto.getUserId());
        System.out.println("Product ID: " + addProductInCartDto.getProductId());
        System.out.println("Quantity: " + addProductInCartDto.getQuantity());

        // Find the active order for the user with status "Pending"
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);

        // If no active order is found, create a new order
        if (activeOrder == null) {
            System.out.println("No active order found for user, creating a new order...");
            Optional<User> optionalUser = userRepository.findById(addProductInCartDto.getUserId());
            if (optionalUser.isPresent()) {
                activeOrder = new Order();
                activeOrder.setUser(optionalUser.get());
                activeOrder.setOrderStatus(OrderStatus.Pending);
                activeOrder.setTotalAmount(0L);
                activeOrder.setAmount(0L);
                activeOrder.setTrackingId(UUID.randomUUID());
                activeOrder.setCartItems(new ArrayList<>()); // Initialize cart items list

                try {
                    activeOrder = orderRepository.save(activeOrder);
                    System.out.println("New order created with ID: " + activeOrder.getId());
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("An order is already being processed.");
                }
            } else {
                System.out.println("User not found with ID: " + addProductInCartDto.getUserId());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } else {
            System.out.println("Existing order found with ID: " + activeOrder.getId());
        }

        // If activeOrder is still null, return an error response
        if (activeOrder == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create or retrieve an active order.");
        }

        // Check if the product already exists in the cart for this order
        Optional<CartItems> optionalCartItems = cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );

        if (optionalCartItems.isPresent()) {
            // If the product exists, update the quantity
            CartItems existingCartItem = optionalCartItems.get();
            existingCartItem.setQuantity(existingCartItem.getQuantity() + addProductInCartDto.getQuantity());

            // Update order totals
            activeOrder.setTotalAmount(activeOrder.getTotalAmount() + (existingCartItem.getPrice() * addProductInCartDto.getQuantity()));
            activeOrder.setAmount(activeOrder.getAmount() + (existingCartItem.getPrice() * addProductInCartDto.getQuantity()));

            cartItemsRepository.save(existingCartItem);
            orderRepository.save(activeOrder);

            System.out.println("Updated product quantity in cart. Product ID: " + existingCartItem.getProduct().getId());
            return ResponseEntity.status(HttpStatus.OK).body("Product quantity updated in the cart");
        } else {
            // Add a new CartItems entry
            System.out.println("Product not found in the cart, adding a new item...");
            Optional<Product> optionalProduct = productRepository.findById(addProductInCartDto.getProductId());
            if (optionalProduct.isPresent()) {
                Product product = optionalProduct.get();
                CartItems cartItem = new CartItems();
                cartItem.setProduct(product);
                cartItem.setPrice(product.getPrice());
                cartItem.setQuantity(addProductInCartDto.getQuantity());
                cartItem.setUser(activeOrder.getUser());
                cartItem.setOrder(activeOrder);

                cartItemsRepository.save(cartItem);

                // Update order totals
                activeOrder.setTotalAmount(activeOrder.getTotalAmount() + (cartItem.getPrice() * cartItem.getQuantity()));
                activeOrder.setAmount(activeOrder.getAmount() + (cartItem.getPrice() * cartItem.getQuantity()));
                activeOrder.getCartItems().add(cartItem);
                orderRepository.save(activeOrder);

                System.out.println("Added new product to cart. Product ID: " + product.getId());
                return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
            } else {
                System.out.println("Product not found with ID: " + addProductInCartDto.getProductId());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }
        }
    }

    public OrderDto getCartByUserId(Long userId) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(userId, OrderStatus.Pending);
        if (activeOrder == null) {
            throw new RuntimeException("No active order found for user ID: " + userId);
        }

        List<CartItemsDto> cartItemsDtoList = activeOrder.getCartItems()
                .stream()
                .map(CartItems::getCartDto)
                .collect(Collectors.toList());

        OrderDto orderDto = new OrderDto();
        orderDto.setAmount(activeOrder.getAmount());
        orderDto.setId(activeOrder.getId());
        orderDto.setOrderStatus(activeOrder.getOrderStatus());
        orderDto.setTotalAmount(activeOrder.getTotalAmount());
        orderDto.setCartItems(cartItemsDtoList);

        return orderDto;
    }

    public OrderDto increaseProductQuantity(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        if (activeOrder == null) {
            throw new RuntimeException("No active order found for user ID: " + addProductInCartDto.getUserId());
        }

        Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalCartItem.isEmpty()) {
            throw new RuntimeException("Cart item not found for product ID: " + addProductInCartDto.getProductId());
        }

        CartItems cartItem = optionalCartItem.get();
        Product product = cartItem.getProduct();

        activeOrder.setAmount(activeOrder.getAmount() + product.getPrice());
        activeOrder.setTotalAmount(activeOrder.getTotalAmount() + product.getPrice());
        cartItem.setQuantity(cartItem.getQuantity() + 1);

        cartItemsRepository.save(cartItem);
        orderRepository.save(activeOrder);

        return activeOrder.getOrderDto();
    }

    public OrderDto decreaseProductQuantity(AddProductInCartDto addProductInCartDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(addProductInCartDto.getUserId(), OrderStatus.Pending);
        if (activeOrder == null) {
            throw new RuntimeException("No active order found for user ID: " + addProductInCartDto.getUserId());
        }

        Optional<CartItems> optionalCartItem = cartItemsRepository.findByProductIdAndOrderIdAndUserId(
                addProductInCartDto.getProductId(), activeOrder.getId(), addProductInCartDto.getUserId()
        );
        if (optionalCartItem.isEmpty()) {
            throw new RuntimeException("Cart item not found for product ID: " + addProductInCartDto.getProductId());
        }

        CartItems cartItem = optionalCartItem.get();
        Product product = cartItem.getProduct();

        activeOrder.setAmount(activeOrder.getAmount() - product.getPrice());
        activeOrder.setTotalAmount(activeOrder.getTotalAmount() - product.getPrice());
        cartItem.setQuantity(cartItem.getQuantity() - 1);

        if (cartItem.getQuantity() <= 0) {
            cartItemsRepository.delete(cartItem);
            activeOrder.getCartItems().remove(cartItem);
        } else {
            cartItemsRepository.save(cartItem);
        }
        orderRepository.save(activeOrder);

        return activeOrder.getOrderDto();
    }

    public OrderDto placeOrder(PlaceOrderDto placeOrderDto) {
        Order activeOrder = orderRepository.findByUserIdAndOrderStatus(placeOrderDto.getUserId(), OrderStatus.Pending);
        if (activeOrder == null) {
            throw new RuntimeException("No active order found for user ID: " + placeOrderDto.getUserId());
        }

        activeOrder.setOrderDescription(placeOrderDto.getOrderDescription());
        activeOrder.setAddress(placeOrderDto.getAddress());
        activeOrder.setDate(new Date());
        activeOrder.setOrderStatus(OrderStatus.Placed);
        activeOrder.setTrackingId(UUID.randomUUID());

        orderRepository.save(activeOrder);

        Order newOrder = new Order();
        newOrder.setAmount(0L);
        newOrder.setTotalAmount(0L);
        newOrder.setUser(activeOrder.getUser());
        newOrder.setOrderStatus(OrderStatus.Pending);
        orderRepository.save(newOrder);

        return activeOrder.getOrderDto();
    }

    public List<OrderDto> getMyPlacedOrders(Long userId){
        return orderRepository.findByUserIdAndOrderStatusIn(userId, List.of(OrderStatus.Placed, OrderStatus.Shipped,
                OrderStatus.Delivered)).stream()
                .map(Order::getOrderDto)
                .collect(Collectors.toList());
    }
}
