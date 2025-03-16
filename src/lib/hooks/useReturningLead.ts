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
  });

  useEffect(() => {
    // Debug para o localStorage
    console.log('[useReturningLead] DEBUG localStorage:', {
      leadId: localStorage.getItem(LEAD_STORAGE_KEY),
      expiry: localStorage.getItem(LEAD_EXPIRY_KEY)
    });
    
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
            });
          } else {
            // Lead ID encontrado no localStorage, mas não no Sanity
            setState({
              isReturningLead: false,
              isLoading: false,
              error: new Error('Lead não encontrado no banco de dados'),
              data: null,
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
  // Query para buscar o lead e seus relatórios associados
  const query = groq`{
    "lead": *[_type == "lead" && _id == $leadId][0]{
      _id,
      name,
      email,
      companyName,
      mainChallenge,
      improvementGoal,
      "lastInteraction": coalesce(updatedAt, createdAt)
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