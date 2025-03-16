import { groq } from "next-sanity";
import { client } from "@/lib/sanity/client";
import { Service, LeadInfo } from "@/types/service";

// Query para buscar todos os serviços (para listagem)
export async function getAllServices() {
  const query = groq`
    *[_type == "service"] | order(priority desc) {
      _id,
      name,
      "slug": slug.current,
      shortDescription,
      image {
        asset->{
          _ref,
          url
        }
      }
    }
  `;

  return await client.fetch(query);
}

// Query para buscar um serviço específico pelo slug
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  console.log("[serviceQueries] Buscando serviço com slug:", slug);
  const query = groq`
    *[_type == "service" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      shortDescription,
      image {
        asset->{
          _ref,
          url
        }
      },
      fullDescription,
      problemsSolved,
      benefitsHTML,
      howItWorks,
      requirements,
      metrics,
      implementationTimeframe,
      "relatedServices": relatedServices[]-> {
        _id,
        name,
        "slug": slug.current,
        shortDescription,
        image {
          asset->{
            _ref,
            url
          }
        }
      },
      forCompanySize,
      forDigitalMaturity,
      forMainChallenges,
      forImprovementGoals,
      priority
    }
  `;

  return await client.fetch(query, { slug });
}

// Query para buscar informações de um lead específico (para personalização)
export async function getLeadById(leadId: string): Promise<LeadInfo | null> {
  const query = groq`
    *[_type == "lead" && _id == $leadId][0] {
      _id,
      name,
      companyName,
      email,
      mainChallenge,
      improvementGoal,
      companySize,
      maturidadeDigital,
      "recommendedServices": recommendedServices[]-> {
        _id,
        name,
        "slug": slug.current
      }
    }
  `;

  return await client.fetch(query, { leadId });
}

// Query para buscar um serviço específico pelo ID
export async function getServiceById(id: string): Promise<Service | null> {
  console.log("[serviceQueries] Buscando serviço com ID:", id);
  const query = groq`
    *[_type == "service" && _id == $id][0] {
      _id,
      name,
      "slug": slug.current,
      shortDescription,
      image {
        asset->{
          _ref,
          url
        }
      },
      fullDescription,
      problemsSolved,
      benefitsHTML,
      howItWorks,
      requirements,
      metrics,
      implementationTimeframe,
      forCompanySize,
      forDigitalMaturity,
      forMainChallenges,
      forImprovementGoals,
      priority
    }
  `;

  return await client.fetch(query, { id });
}

// Query para verificar se um serviço é recomendado para um lead
export async function isServiceRecommendedForLead(leadId: string, serviceId: string): Promise<boolean> {
  const query = groq`
    *[_type == "lead" && _id == $leadId && $serviceId in recommendedServices[]._ref][0] {
      _id
    }
  `;

  const result = await client.fetch(query, { leadId, serviceId });
  return !!result;
}
