/**
 * Tipos comuns usados em todo o projeto
 */

// Tipos para Lead
export interface LeadData {
  name: string;
  email: string;
  companyName: string;
  jobTitle?: string;
  companySite?: string;
  companySize: string;
  marketingStructure?: string;
  salesTeamSize?: string;
  clientAcquisitionStrategy?: string;
  usesCRM?: string;
  usesAutomation?: string;
  mainChallenge: string;
  improvementGoal: string;
  status?: string;
  reportGenerated?: boolean;
  reportRequested?: boolean;
  reportRequestedAt?: string;
  report?: SanityReference;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Para campos adicionais
}

// Tipos para Serviço
export interface ServiceData {
  _id: string;
  name: string;
  shortDescription: string;
  problemsSolved?: string[];
  forCompanySize?: string[];
  forDigitalMaturity?: string[];
  forMainChallenges?: string[];
  forImprovementGoals?: string[];
  priority?: number;
  [key: string]: unknown; // Para campos adicionais
}

// Tipos para Relatório
export interface ReportData {
  reportId: string;
  lead: SanityReference;
  reportTitle: string;
  summary: string;
  contextAnalysis: PortableTextBlock[];
  recommendedServices: RecommendedService[];
  expiresAt?: string;
  slug?: SanitySlug;
  createdAt?: string;
  views?: number;
  lastViewedAt?: string;
  callToActionClicked?: boolean;
  [key: string]: unknown; // Para campos adicionais
}

// Tipos para Serviço Recomendado
export interface RecommendedService {
  _key: string;
  priority: number;
  customProblemDescription: string;
  customImpactDescription: string;
  customBenefits: string[];
  service: SanityReference;
}

// Tipos para recomendações da IA
export interface RecommendationResult {
  recommendations: Recommendation[];
}

export interface Recommendation {
  serviceName: string;
  problemDescription: string;
  impactDescription: string;
  benefits: string[];
  priority: number;
}

export interface ContextAnalysis {
  visaoGeral: string;
  analiseContexto: string;
}

// Tipos auxiliares do Sanity
export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

export interface SanitySlug {
  _type: 'slug';
  current: string;
}

export interface PortableTextBlock {
  _type: string;
  children: PortableTextSpan[];
  [key: string]: unknown;
}

export interface PortableTextSpan {
  _type: string;
  text: string;
  [key: string]: unknown;
}

// Tipos de resposta
export interface ReportResponse {
  success: boolean;
  reportId: string;
  reportSlug: string;
  reportUrl: string;
}

// Tipos para o Quiz
export type QuizAnswerValue = string | boolean | number;

export interface QuizPreview {
  leadId: string;
  email: string;
  recommendedService: string;
  problemSolved: string;
  benefit: string;
  additionalServices: number;
  reportRequested: boolean;
  simulatedMode?: boolean;
  reportUrl?: string;
} 