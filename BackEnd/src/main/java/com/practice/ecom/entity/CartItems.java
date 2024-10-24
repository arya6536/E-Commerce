package com.practice.ecom.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.practice.ecom.dto.CartItemsDto;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data

public class CartItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long price;

    private Long quantity;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER,optional = false)
    @JoinColumn(name = "order_id",nullable = false)
    @JsonIgnore
    private Order order;

    public CartItemsDto getCartDto(){
        CartItemsDto cartItemsDto = new CartItemsDto();

        cartItemsDto.setId(id);
        cartItemsDto.setPrice(price);
        cartItemsDto.setProductId(product.getId());
        cartItemsDto.setQuantity(quantity);
        cartItemsDto.setUserId(user.getId());
        cartItemsDto.setProductName(product.getName());
        cartItemsDto.setReturnedImg(product.getImg());

        return cartItemsDto;
    }
}
