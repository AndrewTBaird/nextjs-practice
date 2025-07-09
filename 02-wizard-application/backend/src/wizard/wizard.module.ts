import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WizardController } from './wizard.controller';
import { WizardService } from './wizard.service';
import { WizardSession } from './entities/wizard-session.entity';
import { QuoteRequest } from './entities/quote-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WizardSession, QuoteRequest])],
  controllers: [WizardController],
  providers: [WizardService],
  exports: [WizardService]
})
export class WizardModule {}
