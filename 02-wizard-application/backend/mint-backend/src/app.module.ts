import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WizardModule } from './wizard/wizard.module';
import { QuoteRequestController } from './quote-request/quote-request.controller';
import { WizardSession } from './wizard/entities/wizard-session.entity';
import { QuoteRequest } from './wizard/entities/quote-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [WizardSession, QuoteRequest],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([QuoteRequest]),
    WizardModule
  ],
  controllers: [AppController, QuoteRequestController],
  providers: [AppService],
})
export class AppModule {}
