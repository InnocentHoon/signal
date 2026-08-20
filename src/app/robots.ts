import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://signalapp.io';
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login', '/register', '/privacy', '/terms'],
        disallow: ['/dashboard', '/analytics', '/content', '/api/', '/settings', '/onboarding'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
