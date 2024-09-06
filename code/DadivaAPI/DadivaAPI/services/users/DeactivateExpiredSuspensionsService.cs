


namespace DadivaAPI.services.users
{
    public class DeactivateExpiredSuspensionsService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24);
        //private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

        public DeactivateExpiredSuspensionsService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var usersService = scope.ServiceProvider.GetRequiredService<IUsersService>();
                    await usersService.DeactivateSuspensionsEndingToday();
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}

