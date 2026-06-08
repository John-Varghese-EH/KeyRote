import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'anthropic-ai', 'Google-Extended', 'PerplexityBot'],
        allow: ['/docs', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin/', '/api/'],
      }
    ],
    sitemap: 'https://john-varghese-eh.github.io/KeyRote/sitemap.xml',
    host: 'https://john-varghese-eh.github.io/KeyRote',
  };
}
