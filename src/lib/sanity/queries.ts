import { groq } from 'next-sanity'

export const getReportBySlug = groq`
  *[_type == "report" && slug.current == $slug][0] {
    _id,
    reportId,
    reportTitle,
    summary,
    contextAnalysis,
    createdAt,
    views,
    lead->{
      name,
      companyName,
      companySize,
      maturidadeDigital,
      mainChallenge,
      improvementGoal
    },
    recommendedServices[]{
      _key,
      priority,
      customProblemDescription,
      customImpactDescription,
      customBenefits,
      service->{
        _id,
        name,
        "slug": slug.current,
        shortDescription,
        problemsSolved,
        howItWorks
      }
    }
  }
`

// Buscar serviço pelo ID
export const getServiceById = groq`
  *[_type == "service" && _id == $id][0]{
    _id,
    name,
    shortDescription,
    fullDescription,
    problemsSolved,
    benefitsHTML,
    howItWorks,
    requirements,
    metrics,
    implementationTimeframe,
    image {
      asset-> {
        url
      }
    },
    relatedServices[]->{
      _id,
      name,
      slug,
      shortDescription
    }
  }
`

// Listar todos os serviços
export const getAllServices = groq`
  *[_type == "service"] | order(priority desc) {
    _id,
    name,
    slug,
    shortDescription,
    image {
      asset-> {
        url
      }
    },
    priority
  }
`

// Buscar métricas de leads
export const getLeadsMetrics = groq`
{
  "totalLeads": count(*[_type == "lead"]),
  "newLeadsLastMonth": count(*[_type == "lead" && createdAt > $lastMonth]),
  "conversionRate": count(*[_type == "lead" && reportGenerated == true]) / count(*[_type == "lead"])
}
`