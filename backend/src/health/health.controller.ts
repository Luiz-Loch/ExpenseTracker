import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verify application health' })
  public async check(): Promise<any> {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
