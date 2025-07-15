import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { WizardModule } from './wizard/wizard.module';
import { QuoteRequestModule } from './quote-request/quote-request.module';
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
    WizardModule,
    QuoteRequestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
