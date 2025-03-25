import { getPersonalizedImageUrl } from '../imageUtils';

// Mock da função urlForImage do Sanity
jest.mock('@/lib/sanity/image', () => ({
  urlForImage: jest.fn((source) => ({
    url: () => `https://sanity-url-for-image.com/${source._ref || 'default'}`
  }))
}));

describe('imageUtils', () => {
  describe('getPersonalizedImageUrl', () => {
    const defaultUrl = '/default-image.jpg';
    
    it('retorna a URL de fallback quando leadInfo é null', () => {
      expect(getPersonalizedImageUrl(null, 'welcome', defaultUrl)).toBe(defaultUrl);
    });
    
    it('retorna a URL de fallback quando leadInfo é undefined', () => {
      expect(getPersonalizedImageUrl(undefined, 'welcome', defaultUrl)).toBe(defaultUrl);
    });
    
    it('retorna a URL do novo formato quando disponível', () => {
      const leadInfo = {
        _id: '123',
        name: 'Test Lead',
        email: 'test@example.com',
        customImagesUrls: {
          welcomeImageUrl: 'https://example.com/welcome.jpg'
        }
      };
      
      expect(getPersonalizedImageUrl(leadInfo, 'welcome', defaultUrl))
        .toBe('https://example.com/welcome.jpg');
    });
    
    it('busca no formato legado quando o novo formato não está disponível', () => {
      const leadInfo = {
        _id: '123',
        name: 'Test Lead',
        email: 'test@example.com',
        customImages: {
          welcomeImage: {
            asset: {
              url: 'https://example.com/legacy-welcome.jpg'
            }
          }
        }
      };
      
      expect(getPersonalizedImageUrl(leadInfo, 'welcome', defaultUrl))
        .toBe('https://example.com/legacy-welcome.jpg');
    });
    
    it('usa urlForImage quando o asset legado não tem URL direta', () => {
      const leadInfo = {
        _id: '123',
        name: 'Test Lead',
        email: 'test@example.com',
        customImages: {
          welcomeImage: {
            _type: 'image',
            asset: {
              _ref: 'image-123'
            }
          }
        }
      };
      
      expect(getPersonalizedImageUrl(leadInfo, 'welcome', defaultUrl))
        .toBe('https://sanity-url-for-image.com/image-123');
    });
    
    it('retorna a URL de fallback quando nenhuma imagem é encontrada', () => {
      const leadInfo = {
        _id: '123',
        name: 'Test Lead',
        email: 'test@example.com'
      };
      
      expect(getPersonalizedImageUrl(leadInfo, 'welcome', defaultUrl))
        .toBe(defaultUrl);
    });
    
    it('retorna a URL de fallback quando há um erro ao gerar URL da imagem legada', () => {
      const leadInfo = {
        _id: '123',
        name: 'Test Lead',
        email: 'test@example.com',
        customImages: {
          welcomeImage: {} // Objeto inválido que causará erro
        }
      };
      
      // Forçar um erro na geração da URL
      const urlForImageMock = require('@/lib/sanity/image').urlForImage;
      urlForImageMock.mockImplementationOnce(() => {
        throw new Error('URL generation error');
      });
      
      expect(getPersonalizedImageUrl(leadInfo, 'welcome', defaultUrl))
        .toBe(defaultUrl);
    });
  });
});
