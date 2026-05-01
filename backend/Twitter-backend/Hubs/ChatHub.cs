using Microsoft.AspNetCore.SignalR;

namespace Twitter_backend.Hubs
{
    public class ChatHub : Hub
    {
        // We don't necessarily need methods here if we are only broadcasting from the controller,
        // but it's good practice to have the Hub defined.
    }
}
