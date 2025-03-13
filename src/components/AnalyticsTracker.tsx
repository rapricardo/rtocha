"use client"

import { useEffect } from 'react'

type AnalyticsTrackerProps = {
  reportId: string
}

export function AnalyticsTracker({ reportId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Registrar visualização da página
    console.log(`Relatório visualizado: ${reportId}`)
    
    // Rastrear profundidade de rolagem
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const scrollPercentage = (scrollPosition / (docHeight - windowHeight)) * 100
      
      // Registrar pontos específicos
      if (scrollPercentage > 75 && !localStorage.getItem(`report-${reportId}-75`)) {
        console.log(`Relatório ${reportId}: leitura profunda (75%)`)
        localStorage.setItem(`report-${reportId}-75`, 'true')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reportId])
  
  return null
}