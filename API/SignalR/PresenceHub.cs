﻿using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        [Authorize]
        public override async Task OnConnectedAsync()
        {
            await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", currentUsers);

            await base.OnDisconnectedAsync(ex);
        }
    }
}
