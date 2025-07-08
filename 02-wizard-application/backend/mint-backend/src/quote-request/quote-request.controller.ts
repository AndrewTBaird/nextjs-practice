import { Controller, Post, Body } from '@nestjs/common';
import { WizardData } from '../wizard/dto/wizard.dto';

export class CreateQuoteRequestDto {
  sessionId: string;
  formData: WizardData;
}

export class QuoteRequestResponseDto {
  success: boolean;
  quoteRequestId: string;
  message: string;
}

@Controller('quote-request')
export class QuoteRequestController {
  
  @Post()
  create(@Body() createQuoteRequestDto: CreateQuoteRequestDto): QuoteRequestResponseDto {
    // TODO: Save to database
    const quoteRequestId = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    return {
      success: true,
      quoteRequestId,
      message: 'Quote request submitted successfully. Our team will contact you soon.'
    };
  }
}
