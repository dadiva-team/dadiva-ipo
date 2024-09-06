namespace DadivaAPI.services.form
{
    using System;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;

    public class NotificationClient
    {
        private readonly HttpContext _context;
        private readonly HttpResponse _response;

        public string Id { get; } = Guid.NewGuid().ToString();

        public NotificationClient(HttpContext context)
        {
            _context = context;
            _response = context.Response;
        }

        public async Task ProcessAsync()
        {
            _context.RequestAborted.Register(() => OnClientDisconnected());
            Console.WriteLine($"Client connected: {Id}");

            // Force start the response to ensure the connection is established
            await _response.WriteAsync(":ok\n\n");
            await _response.Body.FlushAsync();

            while (!_context.RequestAborted.IsCancellationRequested)
            {
                await Task.Delay(1000); // Keeping the connection alive
            }
        }

        public async Task SendMessageAsync(string message)
        {
            if (_response.HasStarted)
            {
                Console.WriteLine($"Sending message to client {Id}: {message}");
                var eventFormatted = $"data: {message}\n\n";
                await _response.Body.WriteAsync(Encoding.UTF8.GetBytes(eventFormatted));
                await _response.Body.FlushAsync();
            }
        }

        private void OnClientDisconnected()
        {
            Console.WriteLine($"Client disconnected: {Id}");
            // Handle client disconnection if needed
        }
    }
}