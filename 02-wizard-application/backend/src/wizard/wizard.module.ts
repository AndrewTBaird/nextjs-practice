import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WizardController } from './wizard.controller';
import { WizardService } from './wizard.service';
import { WizardSession } from './entities/wizard-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WizardSession])],
  controllers: [WizardController],
  providers: [WizardService],
  exports: [WizardService]
})
export class WizardModule {}
