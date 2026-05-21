export const getSanitizedCallbackUrlForLogin = (url: string): string => {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return '/';
  }

  const forbiddenRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/reset',
    '/auth/verify',
    '/_error',
    '/404',
    '/500'
  ];

  const pathName = url.split('?')[0];

  if (forbiddenRoutes.includes(pathName)) {
    return '/';
  }

  return url;
};
