const frontendUrl = process.env.FRONTEND_URL;

const url = (path: string, params?: Record<string, string | number>) => {
  const url = new URL(path, frontendUrl);
  if (params)
    for (const key in params) url.searchParams.set(key, String(params[key]));
  return url.toString();
};

export const verifyEmailLink = (token: string) =>
  url('/verify-email', { token });

export const resetPasswordLink = (token: string) =>
  url('/reset-password', { token });
