package com.acem.cmos.controller;

import com.acem.cmos.dto.OrderRequest;
import com.acem.cmos.entity.Order;
import com.acem.cmos.entity.OrderStatus;
import com.acem.cmos.entity.User;
import com.acem.cmos.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT')")
    public Order placeOrder(@jakarta.validation.Valid @RequestBody OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal(); // Casting is generally safe here if Auth provider returns
                                                          // User, but cleaner to rely on UserDetails if possible.
                                                          // Keeping as is for now as it works, just adding Valid.
        return orderService.placeOrder(user.getId(), orderRequest);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('STUDENT')")
    public List<Order> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return orderService.getStudentOrders(user.getId());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }
}
