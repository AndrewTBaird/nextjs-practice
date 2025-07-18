import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quote_requests')
export class QuoteRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  quoteRequestId: string;

  @Column({ nullable: true })
  sessionId: string;

  // Address information
  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column({ length: 10 })
  zipCode: string;

  // System information
  @Column({ type: 'varchar', length: 20 })
  units: string; // 'one' | 'two' | 'more-than-3' | 'dont-know'

  @Column({ type: 'varchar', length: 20, nullable: true })
  systemType: string; // 'split' | 'package' | 'dont-know'

  @Column({ type: 'varchar', length: 20, nullable: true })
  heatingType: string; // 'heat-pump' | 'gas' | 'dont-know'

  // Contact information
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}