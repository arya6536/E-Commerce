package com.practice.ecom.repository;

import com.practice.ecom.entity.Order;
import com.practice.ecom.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    Order findByUserIdAndOrderStatus (Long userId, OrderStatus orderStatus);

    List<Order> findAllByOrderStatusIn(List<OrderStatus> orderStatusList);
    List<Order> findByUserIdAndOrderStatusIn(Long userId, List<OrderStatus> orderStatus);

}
