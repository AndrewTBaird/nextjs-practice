'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { WizardLayout } from '@/components/wizard/WizardLayout';

export default function Home() {
  return (<WizardLayout />);
}