import env from '@mangayomu/vercel-env';
import { google } from 'googleapis';

export const googleClient = new google.auth.OAuth2(
  env().GOOGLE_OAUTH2_ID,
  env().GOOGLE_OAUTH2_SECRET,
  env().AUTH_URL.provider('google'),
);
