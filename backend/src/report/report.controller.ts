import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { SummaryReport } from './types/summary.types';
import { MonthlyReport } from './types/monthly.type';
import { ByCategoryReport } from './types/by-category.type';
import { SummaryQueryDto } from './dto/summary.query.dto';
import { MonthlyQueryDto } from './dto/monthly.query.dto';
import { ByCategoryQueryDto } from './dto/by-category.query.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SummaryResponseDto } from './dto/response-summary.dto';
import { MonthlyResponseDto } from './dto/response-monthly.dto';
import { ByCategoryResponseDto } from './dto/response-by-category.dto';

@Controller('reports')
@ApiTags('Reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class ReportController {

  public constructor(
    private readonly reportService: ReportService,
  ) { }

  @Get('summary')
  @ApiOkResponse({ type: SummaryResponseDto })
  public async summary(
    @CurrentUserId() userId: string,
    @Query() query: SummaryQueryDto,
  ): Promise<SummaryResponseDto> {
    const summary: SummaryReport = await this.reportService.summary(userId, query);
    return new SummaryResponseDto(summary);
  }

  @Get('monthly')
  @ApiOkResponse({ type: MonthlyResponseDto }) public async monthly(
    @CurrentUserId() userId: string,
    @Query() query: MonthlyQueryDto,
  ): Promise<MonthlyResponseDto> {
    const monthly: MonthlyReport = await this.reportService.monthly(userId, query);
    return new MonthlyResponseDto(monthly);
  }

  @Get('by-category')
  @ApiOkResponse({ type: ByCategoryResponseDto }) public async byCategory(
    @CurrentUserId() userId: string,
    @Query() query: ByCategoryQueryDto,
  ): Promise<ByCategoryResponseDto> {
    const byCategory: ByCategoryReport = await this.reportService.byCategory(userId, query);
    return new ByCategoryResponseDto(byCategory);
  }
}
