import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UrlCheckerService } from 'src/url-checker/url-checker.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [UrlCheckerService],
  exports: [UrlCheckerService],
})
export class UrlCheckerModule {}
