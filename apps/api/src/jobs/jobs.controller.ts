import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  idPramSchema,
  JobCreateDtoApi,
  JobCreateResponseApi,
  JobDetailsREsponseApi,
  VoidOkResult,
} from 'src/jobs/domain/dto/dtos';
import { JobsService } from 'src/jobs/jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly _jobsService: JobsService) {}

  @Post()
  @ApiOkResponse({ type: JobCreateResponseApi })
  async createJob(@Body() dto: JobCreateDtoApi): Promise<JobCreateResponseApi> {
    return this._jobsService.createJob(dto);
  }

  @ApiOkResponse({ type: [JobDetailsREsponseApi] })
  @Get()
  async getAllJobs(): Promise<JobDetailsREsponseApi[]> {
    return this._jobsService.getAllJobs();
  }

  @ApiOkResponse({ type: JobDetailsREsponseApi })
  @Get(':id')
  async getJobById(
    @Param('id', new ZodValidationPipe(idPramSchema)) id: string,
  ): Promise<JobDetailsREsponseApi> {
    return this._jobsService.getJobById(id);
  }

  @ApiOkResponse({ type: VoidOkResult })
  @Delete(':id')
  async cancelJob(
    @Param('id', new ZodValidationPipe(idPramSchema)) id: string,
  ): Promise<VoidOkResult> {
    this._jobsService.cancelJob(id);
    return { result: 'ok' } as VoidOkResult;
  }
}
