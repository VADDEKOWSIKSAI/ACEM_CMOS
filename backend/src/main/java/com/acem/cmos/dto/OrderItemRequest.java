package com.acem.cmos.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    @jakarta.validation.constraints.NotNull(message = "Material ID is required")
    private Long materialId;

    @jakarta.validation.constraints.NotNull(message = "Quantity is required")
    @jakarta.validation.constraints.Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
