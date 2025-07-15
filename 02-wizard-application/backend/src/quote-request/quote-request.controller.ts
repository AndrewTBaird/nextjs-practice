import { Controller, Post, Body } from '@nestjs/common';
import { WizardData } from '../wizard/dto/wizard.dto';
import { QuoteRequestService } from './quote-request.service';

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
  constructor(
    private readonly quoteRequestService: QuoteRequestService,
  ) {}
  
  @Post()
  async create(@Body() createQuoteRequestDto: CreateQuoteRequestDto): Promise<QuoteRequestResponseDto> {
    return this.quoteRequestService.create(createQuoteRequestDto);
  }
}
