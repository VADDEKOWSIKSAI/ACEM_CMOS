import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (material) => {
        setCart((prev) => {
            const exists = prev.find(item => item.materialId === material.id);
            if (exists) {
                return prev.map(item =>
                    item.materialId === material.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                materialId: material.id,
                quantity: 1,
                title: material.title,
                price: material.price,
                imageUrl: material.imageUrl
            }];
        });
    };

    const removeFromCart = (materialId) => {
        setCart(prev => prev.filter(item => item.materialId !== materialId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const updateQuantity = (materialId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.materialId === materialId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
