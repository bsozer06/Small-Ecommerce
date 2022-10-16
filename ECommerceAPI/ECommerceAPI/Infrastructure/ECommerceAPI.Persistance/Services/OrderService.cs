﻿using ECommerceAPI.Application.Abstractions.Services;
using ECommerceAPI.Application.Dtos.Order;
using ECommerceAPI.Application.Repositories;

namespace ECommerceAPI.Persistance.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderWriteRepository _orderWriteRepository;

        public OrderService(IOrderWriteRepository orderWriteRepository)
        {
            _orderWriteRepository = orderWriteRepository;
        }


        public async Task CreateOrderAsync(CreateOrder createOrder)
        {
            await _orderWriteRepository.AddAsync(new()
            {
                Address = createOrder.Address,
                Id = Guid.Parse(createOrder.BasketId),
                Description = createOrder.Description,
            });

            await _orderWriteRepository.SaveAsync();
        }


    }
}