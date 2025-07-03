import { Controller, Post, Body } from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    create(@Body() createLeadDto: any): any {
        return this.leadsService.create(createLeadDto)
    }

}
