namespace DadivaAPI.services.form
{
    using Microsoft.Extensions.Hosting;
    using System;
    using System.Threading;
    using System.Threading.Tasks;

    public class UnlockExpiredSubmissionsService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _unlockInterval = TimeSpan.FromMinutes(30);
        private readonly TimeSpan _lockTimeout = TimeSpan.FromMinutes(10);

        public UnlockExpiredSubmissionsService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var submissionServices = scope.ServiceProvider.GetRequiredService<ISubmissionService>();
                    await submissionServices.UnlockExpiredSubmissions(_lockTimeout);
                }

                await Task.Delay(_unlockInterval, stoppingToken);
            }
        }
    }
}