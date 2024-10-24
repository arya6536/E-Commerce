package com.practice.ecom.entity;

import com.practice.ecom.dto.OrderDto;
import com.practice.ecom.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    

    @ManyToOne(fetch = FetchType.EAGER,cascade = CascadeType.MERGE, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = false)
    private User user;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItems> cartItems = new ArrayList<>();


    public OrderDto getOrderDto() {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(this.id);
        orderDto.setOrderDescription(this.orderDescription);
        orderDto.setDate(this.date);
        orderDto.setAmount(this.amount);
        orderDto.setAddress(this.address);
        orderDto.setPayment(this.payment);
        orderDto.setOrderStatus(this.orderStatus);
        orderDto.setUserName(user.getName());

        return orderDto;
    }
}
