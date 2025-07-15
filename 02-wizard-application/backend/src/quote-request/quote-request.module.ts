import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteRequestController } from './quote-request.controller';
import { QuoteRequestService } from './quote-request.service';
import { QuoteRequest } from '../wizard/entities/quote-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteRequest])],
  controllers: [QuoteRequestController],
  providers: [QuoteRequestService],
  exports: [QuoteRequestService]
})
export class QuoteRequestModule {}