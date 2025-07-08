import { Controller, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WizardData } from '../wizard/dto/wizard.dto';
import { QuoteRequest } from '../wizard/entities/quote-request.entity';

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
    @InjectRepository(QuoteRequest)
    private quoteRequestRepository: Repository<QuoteRequest>,
  ) {}
  
  @Post()
  async create(@Body() createQuoteRequestDto: CreateQuoteRequestDto): Promise<QuoteRequestResponseDto> {
    const { sessionId, formData } = createQuoteRequestDto;
    
    // Generate a quote request ID
    const quoteRequestId = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    // Save quote request to database
    const quoteRequest = this.quoteRequestRepository.create({
      quoteRequestId,
      sessionId,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zipCode: formData.address.zipCode,
      units: formData.units,
      systemType: formData.systemType,
      heatingType: formData.heatingType,
      name: formData.contactInfo.name,
      phone: formData.contactInfo.phone,
      email: formData.contactInfo.email,
    });
    
    await this.quoteRequestRepository.save(quoteRequest);
    
    return {
      success: true,
      quoteRequestId,
      message: 'Quote request submitted successfully. Our team will contact you soon.'
    };
  }
}
