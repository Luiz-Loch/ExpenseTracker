import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SummaryReport } from './types/report.types';
import { MonthlyReport } from './types/monthly.type';
import { ByCategoryReport } from './types/by-category.type';
import { SummaryQueryDto } from './dto/summary.query.dto';
import { MonthlyQueryDto } from './dto/monthly.query.dto';
import { ByCategoryQueryDto } from './dto/by-category.query.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  
  public constructor(
    private readonly reportService: ReportService,
  ) { }

  @Get('summary')
  public async summary(
    @CurrentUserId() userId: string,
    @Query() query: SummaryQueryDto,
  ): Promise<SummaryReport> {
    return this.reportService.summary(userId, query);
  }

  @Get('monthly')
  public async monthly(
    @CurrentUserId() userId: string,
    @Query() query: MonthlyQueryDto,
  ): Promise<MonthlyReport> {
    return this.reportService.monthly(userId, query);
  }

  @Get('by-category')
  public async byCategory(
    @CurrentUserId() userId: string,
    @Query() query: ByCategoryQueryDto,
  ): Promise<ByCategoryReport> {
    return this.reportService.byCategory(userId, query);
  }
}
