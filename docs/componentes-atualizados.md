# Componentes Atualizados para Utilizar URLs de Imagens

Este documento contém exemplos de como atualizar os componentes da aplicação para utilizar o novo formato de URLs de imagens.

## 1. Componente PersonalizedImage

Este é um novo componente que abstrairá a lógica de obtenção de imagens, utilizando a função `getImageUrl` do hook `useReturningLead`.

```tsx
// src/components/personalization/PersonalizedImage.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReturningLead, getImageUrl } from '@/lib/hooks/useReturningLead';

interface PersonalizedImageProps {
  imageType: 'welcome' | 'ctaService' | 'ctaWhatsapp' | 'results';
  fallbackSrc: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  showBadge?: boolean;
}

export default function PersonalizedImage({
  imageType,
  fallbackSrc,
  alt,
  width = 600,
  height = 400,
  priority = false,
  className = '',
  showBadge = true
}: PersonalizedImageProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();
  const [imageSrc, setImageSrc] = useState(fallbackSrc);
  const [isPersonalized, setIsPersonalized] = useState(false);
  
  useEffect(() => {
    if (!isLoading && isReturningLead && data?.lead) {
      const personalizedUrl = getImageUrl(data.lead, imageType);
      if (personalizedUrl) {
        setImageSrc(personalizedUrl);
        setIsPersonalized(true);
      }
    }
  }, [isLoading, isReturningLead, data, imageType]);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image 
        src={imageSrc}
        width={width}
        height={height}
        alt={alt}
        className="transition-all duration-500 w-full h-auto"
        priority={priority}
      />
      {isPersonalized && showBadge && (
        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#d32b36] to-[#e67a48] text-white text-xs px-2 py-1 rounded-md shadow-md">
          Personalizado para você
        </div>
      )}
    </div>
  );
}
```

## 2. Atualização do Componente WelcomeBackBanner

```tsx
// src/components/personalization/WelcomeBackBanner.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useReturningLead } from '@/lib/hooks/useReturningLead';
import PersonalizedImage from './PersonalizedImage'; // Novo componente

interface WelcomeBackBannerProps {
  className?: string;
}

export default function WelcomeBackBanner({ className = '' }: WelcomeBackBannerProps) {
  const { isReturningLead, isLoading, data } = useReturningLead();
  
  if (isLoading || !isReturningLead || !data?.lead) {
    return null;
  }
  
  const lead = data.lead;
  const lastReport = data.reports.length > 0 ? data.reports[0] : null;
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/3">
          {/* Usar o novo componente PersonalizedImage */}
          <PersonalizedImage 
            imageType="welcome"
            fallbackSrc="/images/default-welcome.jpg"
            alt="Bem-vindo de volta"
            width={600}
            height={400}
            priority={true}
            className="h-48 w-full object-cover md:h-full"
          />
        </div>
        <div className="p-8 md:w-2/3">
          <div className="uppercase tracking-wide text-sm text-[#d32b36] font-semibold">Bem-vindo de volta</div>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            Olá, {lead.name}!
          </h2>
          <p className="mt-2 text-gray-600">
            {lastReport ? (
              <>
                Continuando de onde paramos, tenho algumas atualizações sobre 
                {lead.companyName ? ` a ${lead.companyName}` : " seu negócio"} 
                e suas metas de {lead.improvementGoal}.
              </>
            ) : (
              <>
                É bom ver você novamente! Estou aqui para ajudar com seus objetivos 
                de {lead.improvementGoal}.
              </>
            )}
          </p>
          
          {lastReport && (
            <div className="mt-4">
              <Link href={`/relatorios/${lastReport.slug.current}`}
                className="inline-block px-4 py-2 bg-gradient-to-r from-[#d32b36] to-[#e67a48] text-white font-medium rounded-md">
                Ver seu relatório
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 3. Atualização do Componente PersonalizedServiceBanner

```tsx
// src/components/services/PersonalizedServiceBanner.tsx
'use client';

import { useEffect, useState } from "react";
import { LeadInfo, Service } from "@/types/service";
import { checkServiceCompatibility, generatePersonalizedMessage } from "@/lib/services/serviceUtils";
import PersonalizedImage from "@/components/personalization/PersonalizedImage"; // Novo componente

interface PersonalizedServiceBannerProps {
  leadInfo: LeadInfo | null;
  service: Service;
  isRecommended: boolean;
}

export default function PersonalizedServiceBanner({ 
  leadInfo, 
  service, 
  isRecommended 
}: PersonalizedServiceBannerProps) {
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    if (leadInfo) {
      const personMsg = generatePersonalizedMessage(leadInfo, service, isRecommended);
      setMessage(personMsg);
    }
  }, [leadInfo, service, isRecommended]);
  
  if (!leadInfo || !message) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/3">
          {/* Usar o novo componente PersonalizedImage */}
          <PersonalizedImage 
            imageType="ctaService"
            fallbackSrc="/images/service-default.jpg"
            alt={`${service.name} para ${leadInfo.companyName || 'sua empresa'}`}
            className="h-48 w-full object-cover md:h-full"
          />
        </div>
        <div className="p-8 md:w-2/3">
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
            {isRecommended ? 'Recomendado para você' : 'Personalizado para você'}
          </div>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {leadInfo.name}, este serviço pode ajudar {leadInfo.companyName ? `a ${leadInfo.companyName}` : 'seu negócio'}
          </h2>
          <p className="mt-2 text-gray-600">{message}</p>
          
          <div className="mt-4">
            <a href="#contato" 
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-md">
              Saber mais sobre este serviço
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 4. Exemplo de Função para Atualizar Lead com URLs de Imagens

Esta função pode ser usada nas ações de API para atualizar um lead com novas URLs de imagens:

```typescript
// src/app/api/update-lead-images/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

interface UpdateImagesRequest {
  leadId: string;
  welcomeImageUrl?: string;
  ctaServiceImageUrl?: string;
  ctaWhatsappImageUrl?: string;
  resultsImageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: UpdateImagesRequest = await req.json();
    const { leadId, ...imageUrls } = body;
    
    if (!leadId) {
      return NextResponse.json({ success: false, error: 'leadId é obrigatório' }, { status: 400 });
    }
    
    // Preparar objeto de imagens para atualização
    const customImagesUrls: Record<string, string> = {};
    
    if (imageUrls.welcomeImageUrl) customImagesUrls.welcomeImageUrl = imageUrls.welcomeImageUrl;
    if (imageUrls.ctaServiceImageUrl) customImagesUrls.ctaServiceImageUrl = imageUrls.ctaServiceImageUrl;
    if (imageUrls.ctaWhatsappImageUrl) customImagesUrls.ctaWhatsappImageUrl = imageUrls.ctaWhatsappImageUrl;
    if (imageUrls.resultsImageUrl) customImagesUrls.resultsImageUrl = imageUrls.resultsImageUrl;
    
    // Atualizar o documento no Sanity
    const result = await sanityClient
      .patch(leadId)
      .setIfMissing({ customImagesUrls: {} })
      .set({ customImagesUrls })
      .commit();
      
    return NextResponse.json({ 
      success: true, 
      message: 'Imagens atualizadas com sucesso',
      lead: result 
    });
  } catch (error) {
    console.error('Erro ao atualizar imagens do lead:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
}
```

## 5. Script de Migração para Dados Existentes

Este script pode ser usado para migrar dados existentes do formato antigo para o novo formato:

```typescript
// scripts/migrate-image-urls.ts

import { sanityClient } from '../src/lib/sanity/client';
import { groq } from 'next-sanity';

async function migrateImageUrls() {
  try {
    console.log('Iniciando migração de URLs de imagens...');
    
    // Buscar todos os leads com imagens no formato antigo
    const query = groq`*[_type == "lead" && defined(customImages)]`;
    const leads = await sanityClient.fetch(query);
    
    console.log(`Encontrados ${leads.length} leads para migração.`);
    
    // Processar cada lead
    for (const lead of leads) {
      console.log(`Processando lead: ${lead._id} (${lead.name})`);
      
      const customImagesUrls: Record<string, string> = {};
      
      // Extrair URLs das imagens existentes
      if (lead.customImages?.welcomeImage?.asset?.url) {
        customImagesUrls.welcomeImageUrl = lead.customImages.welcomeImage.asset.url;
      }
      
      if (lead.customImages?.ctaServiceImage?.asset?.url) {
        customImagesUrls.ctaServiceImageUrl = lead.customImages.ctaServiceImage.asset.url;
      }
      
      if (lead.customImages?.ctaWhatsappImage?.asset?.url) {
        customImagesUrls.ctaWhatsappImageUrl = lead.customImages.ctaWhatsappImage.asset.url;
      }
      
      if (lead.customImages?.resultsImage?.asset?.url) {
        customImagesUrls.resultsImageUrl = lead.customImages.resultsImage.asset.url;
      }
      
      // Atualizar o documento no Sanity se houver URLs para migrar
      if (Object.keys(customImagesUrls).length > 0) {
        await sanityClient
          .patch(lead._id)
          .setIfMissing({ customImagesUrls: {} })
          .set({ customImagesUrls })
          .commit();
          
        console.log(`✅ Migrado com sucesso: ${lead._id}`);
      } else {
        console.log(`⚠️ Nenhuma URL de imagem encontrada para: ${lead._id}`);
      }
    }
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  }
}

// Executar o script
migrateImageUrls();
```

## 6. Utilização do Novo Hook no Layout do Relatório

```tsx
// src/app/relatorios/[slug]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useReturningLead, getImageUrl } from '@/lib/hooks/useReturningLead';
import { ReportData } from '@/types/report';
import PersonalizedImage from '@/components/personalization/PersonalizedImage';

export default function ReportPage({ params }: { params: { slug: string } }) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: leadData } = useReturningLead();
  
  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/reports/${params.slug}`);
        const data = await response.json();
        
        if (data.success) {
          setReport(data.report);
        }
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReport();
  }, [params.slug]);
  
  if (loading) {
    return <div>Carregando relatório...</div>;
  }
  
  if (!report) {
    return <div>Relatório não encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{report.title}</h1>
      
      {/* Seção de resultados com imagem personalizada */}
      <section className="my-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-4">Resultados Esperados</h2>
            <div className="prose max-w-none">
              {/* Conteúdo do relatório */}
            </div>
          </div>
          <div className="md:w-1/2">
            {/* Usar o componente PersonalizedImage para a seção de resultados */}
            <PersonalizedImage 
              imageType="results"
              fallbackSrc="/images/default-results.jpg"
              alt="Resultados personalizados"
              className="h-full w-full object-cover"
              showBadge={false}
            />
          </div>
        </div>
      </section>
      
      {/* Restante do conteúdo do relatório */}
    </div>
  );
}
```

## 7. Exemplo de Atualização com URLs na Interface de Administração

```tsx
// src/app/admin/leads/[id]/update-images/page.tsx

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sanityClient } from '@/lib/sanity/client';
import { groq } from 'next-sanity';

export default function UpdateLeadImagesPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;
  
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    welcomeImageUrl: '',
    ctaServiceImageUrl: '',
    ctaWhatsappImageUrl: '',
    resultsImageUrl: ''
  });
  
  useEffect(() => {
    async function fetchLead() {
      try {
        const query = groq`*[_type == "lead" && _id == $leadId][0]{
          _id, name, email, companyName,
          customImages,
          customImagesUrls
        }`;
        
        const result = await sanityClient.fetch(query, { leadId });
        setLead(result);
        
        // Preencher formulário com dados existentes
        if (result?.customImagesUrls) {
          setFormData({
            welcomeImageUrl: result.customImagesUrls.welcomeImageUrl || '',
            ctaServiceImageUrl: result.customImagesUrls.ctaServiceImageUrl || '',
            ctaWhatsappImageUrl: result.customImagesUrls.ctaWhatsappImageUrl || '',
            resultsImageUrl: result.customImagesUrls.resultsImageUrl || ''
          });
        }
      } catch (error) {
        console.error('Erro ao buscar lead:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const response = await fetch('/api/update-lead-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadId,
          ...formData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Imagens atualizadas com sucesso!');
        router.push(`/admin/leads/${leadId}`);
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar imagens:', error);
      alert('Erro ao processar solicitação');
    } finally {
      setUpdating(false);
    }
  }
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!lead) {
    return <div>Lead não encontrado</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Atualizar Imagens: {lead.name}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block mb-2 font-medium">URL da Imagem de Boas-Vindas</label>
          <input 
            type="url" 
            className="w-full p-2 border rounded"
            value={formData.welcomeImageUrl}
            onChange={(e) => setFormData({...formData, welcomeImageUrl: e.target.value})}
            placeholder="https://exemplo.com/imagem.jpg"
          />
          {formData.welcomeImageUrl && (
            <img 
              src={formData.welcomeImageUrl} 
              alt="Preview" 
              className="mt-2 max-h-40 rounded"
              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
            />
          )}
        </div>
        
        {/* Campos similares para as outras imagens */}
        
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={updating}
        >
          {updating ? 'Atualizando...' : 'Atualizar Imagens'}
        </button>
      </form>
    </div>
  );
}
```

Estes exemplos mostram como atualizar diferentes partes da aplicação para trabalhar com o novo formato de URLs de imagens, enquanto mantém compatibilidade com dados existentes durante o período de transição.
