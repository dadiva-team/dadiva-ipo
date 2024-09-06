namespace DadivaAPI.services.form
{
    using System.Collections.Concurrent;
    using DadivaAPI.domain;
    using System.Threading.Tasks;

    public interface INotificationService
    {
        Task AddClientAsync(NotificationClient client);
        Task RemoveClientAsync(NotificationClient client);
        Task NotifyAllAsync(string message);
    }

    public class NotificationService : INotificationService
    {
        private readonly ConcurrentDictionary<string, NotificationClient> _clients = new ConcurrentDictionary<string, NotificationClient>();

        public Task AddClientAsync(NotificationClient client)
        {
            _clients.TryAdd(client.Id, client);
            Console.WriteLine("Client added");
            return Task.CompletedTask;
        }

        public Task RemoveClientAsync(NotificationClient client)
        {
            _clients.TryRemove(client.Id, out _);
            Console.WriteLine("Client removed");
            return Task.CompletedTask;
        }

        public async Task NotifyAllAsync(string message)
        {
            foreach (var client in _clients.Values)
            {
                Console.WriteLine("Sending message to client");
                await client.SendMessageAsync(message);
            }
        }
    }
}