import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {codeInput} from '@sanity/code-input'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'rtocha',

  projectId: 'wm03zquh',
  dataset: 'producao',

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
})
