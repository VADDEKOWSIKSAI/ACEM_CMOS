package com.acem.cmos.dto;

import com.acem.cmos.entity.PaymentMethod;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    @jakarta.validation.constraints.NotEmpty(message = "Order items cannot be empty")
    @jakarta.validation.Valid
    private List<OrderItemRequest> items;

    @jakarta.validation.constraints.NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
