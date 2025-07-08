import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WizardStep } from '../dto/wizard.dto';

@Entity('wizard_sessions')
export class WizardSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sessionId: string;

  @Column({ type: 'varchar', length: 50 })
  currentStep: WizardStep;

  @Column({ type: 'text' })
  formData: string; // JSON string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}