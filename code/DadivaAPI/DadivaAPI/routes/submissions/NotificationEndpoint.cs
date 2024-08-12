using DadivaAPI.services.form;

namespace DadivaAPI.routes.submissions;

public class NotificationEndpoint
{
    private readonly INotificationService _notificationService;

    public NotificationEndpoint(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleNotificationsAsync(HttpContext context)
    {
        context.Response.Headers["Content-Type"] = "text/event-stream";
        context.Response.Headers["Cache-Control"] = "no-cache";
        context.Response.Headers["Connection"] = "keep-alive";

        if (_notificationService == null)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Notification service not available");
            return;
        }

        var client = new NotificationClient(context);
        await _notificationService.AddClientAsync(client);
        await client.ProcessAsync();
        await _notificationService.RemoveClientAsync(client);
    }
}
