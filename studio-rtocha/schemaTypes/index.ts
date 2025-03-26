// schemas/index.ts
import {postType} from './documents/post'
import {authorType} from './documents/author'
import {categoryType} from './documents/category'
import {calloutType} from './objects/callout'
import {leadType} from './documents/lead'
import {serviceType} from './documents/service'
import {reportType} from './documents/report'
import {personalizationType} from './documents/personalization'

export const schemaTypes = [
  // Documentos existentes
  postType,
  authorType,
  categoryType,
  
  // Novos documentos para o sistema de auditoria
  leadType,
  serviceType,
  reportType,
  personalizationType,
  
  // Objetos
  calloutType
]