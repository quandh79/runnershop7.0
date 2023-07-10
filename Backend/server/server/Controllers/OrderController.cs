using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using server.Helper.order;
using server.Hubs;
using server.Interfaces;
using server.ViewModel;
using PayPal.Core;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class OrderController : ControllerBase
    {
        public readonly IOrderService _orderService;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly string _clientId;
        private readonly string _secretKey;
        public double usdRate = 23000;
        private Guid adminId = new Guid("4557893f-1f56-4b6f-bb3b-caefd62c8c49");
        public OrderController(IOrderService orderService, [NotNull]IHubContext<ChatHub> hubContext, IConfiguration config)
        {
            _orderService = orderService;
            _hubContext = hubContext;
            _clientId = config["PaypalSetting:ClientId"];
            _secretKey = config["PaypalSetting:SetcretKey"];
    }
        [HttpPost]
        //[Authorize(Roles = ("User"))]
        public async Task<IActionResult> create([FromBody]OrderCreateRequest request)
        {

            var orderId = await _orderService.Create(request);
            if (orderId == 0)
            {
                return BadRequest("Đặt hàng thất bại!");
            }
            
            var notify = new NotifyViewModel()
            {
                notify = $"Có khách vừa mới đặt hàng!",
                link = "/admin/order-manage/order-not-confirm",
                //senderId = request.userId.HasValue ? request.userId.Value ? null,
                receiverId = adminId,
                isViewed = false,
                status = enums.NotifyStatus.order,
            };
            await _hubContext.Clients.All.SendAsync("ReceiveNotify", notify);
            return Ok("Đặt hàng thành công! Admin sẽ thông báo đến bạn thông qua số điện thoại hoặc gmail! Trân trọng!");
        }
        [HttpGet("GetOrderListByUserId/{userId}")]
        public async Task<IActionResult> GetOrderListByUserId(Guid userId)
        {
            var list = await _orderService.GetOrderListByUserId(userId);
            return Ok(list);
        }
        [HttpGet("config")]
        public IActionResult PaypalCheckout()
        {
            return Ok(_clientId);

        }
    }
}