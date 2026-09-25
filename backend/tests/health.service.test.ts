import { healthService } from '../src/services/health.service';

describe('HealthService', () => {
  it('should return health status', () => {
    const status = healthService.getHealthStatus();
    expect(status).toHaveProperty('status', 'ok');
    expect(status).toHaveProperty('timestamp');
    expect(status).toHaveProperty('uptime');
  });
});
