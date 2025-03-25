'use client';

import { useState, useEffect } from 'react';
import { groq } from 'next-sanity';
import { client } from '@/lib/sanity/client';

// Definição dos tipos
interface LeadInfo {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  mainChallenge?: string;
  improvementGoal?: string;
  lastInteraction: Date;
  recommendedServices?: {
    _id: string;
    name: string;
    slug: { current: string };
  }[];
  // Mantido para compatibilidade com dados existentes
  customImages?: {
    welcomeImage?: {
      _type: string;
      asset: {
        _id: string;
        url: string;
        path: string;
      };
    };
    ctaServiceImage?: any;
    ctaWhatsappImage?: any;
    resultsImage?: any;
  };
  // Novo formato com URLs
  customImagesUrls?: {
    welcomeImageUrl?: string;
    ctaServiceImageUrl?: string;
    ctaWhatsappImageUrl?: string;
    resultsImageUrl?: string;
  };
  companyAnalysis?: {
    perplexitySummary?: string;
    linkedinAnalysis?: string;
    leadLinkedinAnalysis?: string;
    emotionalPitch?: string;
  };
}

interface LeadReportInfo {
  _id: string;
  reportTitle: string;
  slug: { current: string };
  createdAt: string;
}

interface ReturningLeadData {
  lead: LeadInfo | null;
  reports: LeadReportInfo[];
  lastReportDate: Date | null;
}

interface ReturningLeadState {
  isReturningLead: boolean;
  isLoading: boolean;
  error: Error | null;
  data: ReturningLeadData | null;
  leadInfo?: LeadInfo | null; // Adicionado para facilitar acesso ao lead
}

// Constantes
const LEAD_STORAGE_KEY = 'rt_lead_id';
const LEAD_EXPIRY_KEY = 'rt_lead_expiry';
const STORAGE_DURATION_DAYS = 90; // Armazenar por 90 dias

/**
 * Hook para identificar e recuperar dados de leads retornantes
 */
export function useReturningLead(): ReturningLeadState {
  const [state, setState] = useState<ReturningLeadState>({
    isReturningLead: false,
    isLoading: true,
    error: null,
    data: null,
    leadInfo: null,
  });

  useEffect(() => {
    let isActive = true;
    
    const identifyLead = async () => {
      try {
        // Verificar localStorage por ID do lead
        const storedLeadId = localStorage.getItem(LEAD_STORAGE_KEY);
        const expiryDate = localStorage.getItem(LEAD_EXPIRY_KEY);
        
        // Se não há ID armazenado ou expirou, não é um lead retornante
        if (!storedLeadId || !expiryDate || new Date(expiryDate) < new Date()) {
          if (isActive) {
            setState({
              isReturningLead: false,
              isLoading: false,
              error: null,
              data: null,
              leadInfo: null,
            });
          }
          return;
        }
        
        // Buscar dados do lead no Sanity
        const leadData = await fetchLeadData(storedLeadId);
        
        if (isActive) {
          if (leadData) {
            setState({
              isReturningLead: true,
              isLoading: false,
              error: null,
              data: leadData,
              leadInfo: leadData.lead,
            });
          } else {
            // Lead ID encontrado no localStorage, mas não no Sanity
            setState({
              isReturningLead: false,
              isLoading: false,
              error: new Error('Lead não encontrado no banco de dados'),
              data: null,
              leadInfo: null,
            });
            // Limpar localStorage
            localStorage.removeItem(LEAD_STORAGE_KEY);
            localStorage.removeItem(LEAD_EXPIRY_KEY);
          }
        }
      } catch (error) {
        if (isActive) {
          setState({
            isReturningLead: false,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Erro desconhecido'),
            data: null,
            leadInfo: null,
          });
        }
      }
    };

    identifyLead();
    
    return () => {
      isActive = false;
    };
  }, []);

  return state;
}

/**
 * Armazenar ID do lead quando um novo relatório é gerado
 */
export function storeLeadId(leadId: string): void {
  try {
    // Calcular data de expiração (90 dias a partir de hoje)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + STORAGE_DURATION_DAYS);
    
    localStorage.setItem(LEAD_STORAGE_KEY, leadId);
    localStorage.setItem(LEAD_EXPIRY_KEY, expiryDate.toISOString());
  } catch (error) {
    console.error('Erro ao armazenar ID do lead:', error);
  }
}

/**
 * Buscar dados do lead e relatórios associados no Sanity
 */
async function fetchLeadData(leadId: string): Promise<ReturningLeadData | null> {
  // Query atualizada para buscar ambos os formatos de imagens
  const query = groq`{
    "lead": *[_type == "lead" && _id == $leadId][0]{
      _id,
      name,
      email,
      companyName,
      mainChallenge,
      improvementGoal,
      "lastInteraction": coalesce(updatedAt, createdAt),
      recommendedServices[]->{_id, name, "slug": slug.current},
      
      // Mantido para compatibilidade com dados existentes
      customImages {
        welcomeImage {
          _type,
          asset-> {
            _id,
            url,
            path
          }
        },
        ctaServiceImage {
          _type,
          asset-> {
            _id,
            url,
            path
          }
        },
        ctaWhatsappImage,
        resultsImage
      },
      
      // Novo formato com URLs
      customImagesUrls,
      
      companyAnalysis
    },
    "reports": *[_type == "report" && references($leadId)]{
      _id,
      reportTitle,
      "slug": slug,
      createdAt
    } | order(createdAt desc)
  }`;

  const result = await client.fetch(query, { leadId });
  
  if (!result.lead) {
    return null;
  }
  
  // Encontrar a data do relatório mais recente
  const lastReportDate = result.reports.length > 0 
    ? new Date(result.reports[0].createdAt) 
    : null;
    
  return {
    lead: result.lead,
    reports: result.reports,
    lastReportDate
  };
}

/**
 * Função utilitária para obter URL de imagem considerando ambos os formatos
 */
export function getImageUrl(lead: LeadInfo | null, imageType: 'welcome' | 'ctaService' | 'ctaWhatsapp' | 'results'): string | null {
  if (!lead) return null;
  
  // Primeiro tenta o novo formato com URLs
  if (lead.customImagesUrls) {
    switch (imageType) {
      case 'welcome':
        if (lead.customImagesUrls.welcomeImageUrl) return lead.customImagesUrls.welcomeImageUrl;
        break;
      case 'ctaService':
        if (lead.customImagesUrls.ctaServiceImageUrl) return lead.customImagesUrls.ctaServiceImageUrl;
        break;
      case 'ctaWhatsapp':
        if (lead.customImagesUrls.ctaWhatsappImageUrl) return lead.customImagesUrls.ctaWhatsappImageUrl;
        break;
      case 'results':
        if (lead.customImagesUrls.resultsImageUrl) return lead.customImagesUrls.resultsImageUrl;
        break;
    }
  }
  
  // Se não encontrou no novo formato, tenta o formato antigo
  if (lead.customImages) {
    switch (imageType) {
      case 'welcome':
        if (lead.customImages.welcomeImage?.asset?.url) return lead.customImages.welcomeImage.asset.url;
        break;
      case 'ctaService':
        if (lead.customImages.ctaServiceImage?.asset?.url) return lead.customImages.ctaServiceImage.asset.url;
        break;
      case 'ctaWhatsapp':
        if (lead.customImages.ctaWhatsappImage?.asset?.url) return lead.customImages.ctaWhatsappImage.asset.url;
        break;
      case 'results':
        if (lead.customImages.resultsImage?.asset?.url) return lead.customImages.resultsImage.asset.url;
        break;
    }
  }
  
  // Não encontrou em nenhum formato
  return null;
}