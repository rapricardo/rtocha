'use client';

import { Button } from '@/components/Button';
import { track } from '@vercel/analytics';

interface ReportCTAButtonProps {
  reportId: string;
  leadId?: string;
}

export default function ReportCTAButton({ reportId, leadId }: ReportCTAButtonProps) {
  const handleCtaClick = () => {
    console.log(`Tracking Report CTA Clicked: ${reportId}`);
    track('Report CTA Clicked', {
      reportId: reportId,
      leadId: leadId || 'N/A'
    });
    // Note: The Button component handles the navigation via its href prop.
    // If additional actions were needed after tracking, they would go here.
  };

  return (
    <Button
      variant="accent"
      size="lg"
      href="https://calendly.com/ricardotocha/sessao-estrategica"
      target="_blank"
      onClick={handleCtaClick}
    >
      Agendar Sessão Estratégica
    </Button>
  );
}
