import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRequest } from './entities/quote-request.entity';
import { CreateQuoteRequestDto, QuoteRequestResponseDto } from './quote-request.controller';

@Injectable()
export class QuoteRequestService {
  constructor(
    @InjectRepository(QuoteRequest)
    private quoteRequestRepository: Repository<QuoteRequest>,
  ) {}

  async create(createQuoteRequestDto: CreateQuoteRequestDto): Promise<QuoteRequestResponseDto> {
    const { sessionId, formData } = createQuoteRequestDto;
    
    const quoteRequestId = `quote_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
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