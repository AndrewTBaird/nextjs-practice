import { Injectable } from '@nestjs/common';

interface Lead {
    id: number,
    address: string,
    phone: string
}

@Injectable()
export class LeadsService {
    private leads: Lead[] = [
        { id: 1, address: '123 elm st', phone: '7604209776' }
    ]
    create(createLeadDto: Omit<Lead, 'id'>): Lead {
        const newLead: Lead = {
            id: this.leads.length + 1,
            ...createLeadDto,
        };
        this.leads.push(newLead);
        return newLead;
    }
}
