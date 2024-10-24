package com.practice.ecom.dto;

import com.practice.ecom.entity.CartItems;
import com.practice.ecom.entity.User;
import com.practice.ecom.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
public class OrderDto {

    private Long id;

    private String orderDescription;

    private Date date;

    private Long amount;

    private String address;

    private String payment;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private Long totalAmount;

    private UUID trackingId;

    private String userName;

    private List<CartItemsDto> cartItems = new ArrayList<>();
}
