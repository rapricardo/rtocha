import { PortableTextBlock } from "@portabletext/types";

export interface Service {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image?: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  fullDescription?: PortableTextBlock[];
  problemsSolved?: string[];
  benefitsHTML?: PortableTextBlock[];
  // Novos campos para benefícios
  benefitsList?: {
    _key: string;
    benefit: string;
    description?: string;
  }[];
  // Novos campos para 'como funciona'
  howItWorksSteps?: {
    _key?: string;
    title?: string;
    name?: string;
    description?: string;
    content?: string;
    stepNumber?: number;
  }[];
  howItWorks?: PortableTextBlock[];
  requirements?: string[];
  metrics?: string[];
  implementationTimeframe?: string;
  relatedServices?: Service[];
  forCompanySize?: string[];
  forDigitalMaturity?: string[];
  forMainChallenges?: string[];
  forImprovementGoals?: string[];
  priority?: number;
  // Novos campos de marketing
  marketingTitle?: string;
  marketingDescription?: string;
}

export interface LeadInfo {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  mainChallenge?: string;
  improvementGoal?: string;
  companySize?: string;
  maturidadeDigital?: string;
  recommendedServices?: {
    _id: string;
    name: string;
    slug: string;
  }[];
  // Campo legado para compatibilidade
  customImages?: {
    // Define basic structure for legacy image fields
    welcomeImage?: { asset?: { url?: string; _ref?: string } };
    ctaServiceImage?: { asset?: { url?: string; _ref?: string } };
    ctaWhatsappImage?: { asset?: { url?: string; _ref?: string } };
    resultsImage?: { asset?: { url?: string; _ref?: string } };
  };
  // Novo campo de URLs para imagens personalizadas
  customImagesUrls?: {
    welcomeImageUrl?: string;
    ctaServiceImageUrl?: string;
    ctaWhatsappImageUrl?: string;
    resultsImageUrl?: string;
  };
}
