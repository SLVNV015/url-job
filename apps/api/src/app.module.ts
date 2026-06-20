import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthzController } from 'src/healthz.controller';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JobsModule,
  ],
  controllers: [HealthzController],
  providers: [],
})
export class AppModule {}
