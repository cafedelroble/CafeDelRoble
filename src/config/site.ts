export const siteConfig = {
  name: 'Café del Roble',
  description: 'Café premium de Pereira, Risaralda, Colombia',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  creator: 'Café del Roble',
  keywords: ['café', 'café colombiano', 'café premium', 'Pereira', 'Risaralda', 'café de origen', 'café especial'],
  social: {
    instagram: '',
    facebook: '',
    whatsapp: process.env.WHATSAPP_NUMBER || '',
  },
};
