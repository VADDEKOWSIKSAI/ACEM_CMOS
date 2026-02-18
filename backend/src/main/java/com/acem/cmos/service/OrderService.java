package com.acem.cmos.service;

import com.acem.cmos.dto.OrderItemRequest;
import com.acem.cmos.dto.OrderRequest;
import com.acem.cmos.entity.*;
import com.acem.cmos.repository.MaterialRepository;
import com.acem.cmos.repository.OrderRepository;
import com.acem.cmos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MaterialRepository materialRepository;

    @Transactional
    public Order placeOrder(Long studentId, OrderRequest orderRequest) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Order order = new Order();
        order.setStudent(student);
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(orderRequest.getPaymentMethod() != null ? orderRequest.getPaymentMethod()
                : PaymentMethod.CASH_ON_DELIVERY);

        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Material material = materialRepository.findById(itemRequest.getMaterialId())
                    .orElseThrow(() -> new RuntimeException("Material not found"));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setMaterial(material);
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(material.getPrice());

            items.add(item);
            totalAmount += material.getPrice() * itemRequest.getQuantity();
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public List<Order> getStudentOrders(Long studentId) {
        return orderRepository.findByStudentId(studentId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
