"use client"

import { useEffect } from 'react'
import { track } from '@vercel/analytics'; // Import track function

type AnalyticsTrackerProps = {
  reportId: string;
  leadId?: string; // Optional: Pass leadId if available
}

export function AnalyticsTracker({ reportId, leadId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track report view event
    console.log(`Tracking Report Viewed: ${reportId}`);
    track('Report Viewed', {
      reportId: reportId,
      leadId: leadId || 'N/A' // Include leadId if provided
    });
    
    // Rastrear profundidade de rolagem
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const scrollPercentage = (scrollPosition / (docHeight - windowHeight)) * 100
      
      // Registrar pontos específicos
      const scrollMark75 = `report-${reportId}-scroll-75`;
      if (scrollPercentage > 75 && !sessionStorage.getItem(scrollMark75)) { // Use sessionStorage for session-based tracking
        console.log(`Tracking Report Scrolled 75%: ${reportId}`);
        track('Report Scrolled', {
          reportId: reportId,
          leadId: leadId || 'N/A',
          depth: 75
        });
        sessionStorage.setItem(scrollMark75, 'true');
      }
      // Add more scroll depth points if needed (e.g., 25, 50)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for better scroll performance
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Optional: Clear sessionStorage marks if needed on unmount, though usually not necessary
    }
  }, [reportId, leadId]) // Add leadId to dependency array
  
  return null
}
