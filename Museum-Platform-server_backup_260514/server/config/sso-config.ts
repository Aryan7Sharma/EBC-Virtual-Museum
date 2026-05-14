// SSO Configuration for EBC Identity Provider
// export const ssoConfig = {
//   clientId: '2XYnAUKbfsZgsOTO19gFsvNP8usa',
//   clientSecret: 'Xnz8HK5p3Sqx6L81FexL6zxPijUa',
//   authorizationEndpoint: 'https://sso.ebc.edu.kh/oauth2/authorize',
//   tokenEndpoint: 'https://sso.ebc.edu.kh/oauth2/token',
//   userInfoEndpoint: 'https://sso.ebc.edu.kh/oauth2/userinfo',
//   redirectUri: process.env.SSO_REDIRECT_URI || 'https://yourdomain.com/api/v1/auth/sso/callback',
//   scope: 'openid profile email',
//   responseType: 'code',
//   grantType: 'authorization_code',
// };
export const ssoConfig = {
  clientId: '2XYnAUKbfsZgsOTO19gFsvNP8usa',
  clientSecret: 'Xnz8HK5p3Sqx6L81FexL6zxPijUa',
  authorizationEndpoint: 'https://sso.ebc.edu.kh/oauth2/authorize',
  tokenEndpoint: 'https://sso.ebc.edu.kh/oauth2/token',
  userInfoEndpoint: 'https://sso.ebc.edu.kh/oauth2/userinfo',
  // ✅ THIS MUST MATCH THE REGISTERED URL
  redirectUri: 'https://3d.ebc.edu.kh/api/v1/auth/sso/callback',
  scope: 'openid profile email',
  responseType: 'code',
  grantType: 'authorization_code',
};

// Field mappings from SSO provider to internal fields
export const fieldMappings = {
  username: 'username',
  emailaddress: 'email',
  lastname: 'lastName',
  giventname: 'firstName', // Note: Fixed typo from "giventname" to map to firstName
};

// Generate authorization URL
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: ssoConfig.clientId,
    redirect_uri: ssoConfig.redirectUri,
    response_type: ssoConfig.responseType,
    scope: ssoConfig.scope,
    state, // CSRF protection
  });

  return `${ssoConfig.authorizationEndpoint}?${params.toString()}`;
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<any> {
  const response = await fetch(ssoConfig.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${ssoConfig.clientId}:${ssoConfig.clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: ssoConfig.grantType,
      code,
      redirect_uri: ssoConfig.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

// Fetch user info from SSO provider
export async function fetchUserInfo(accessToken: string): Promise<any> {
  const response = await fetch(ssoConfig.userInfoEndpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch user info: ${error}`);
  }

  return response.json();
}

// Map SSO user data to internal user format
export function mapSSOUserToInternal(ssoUser: any): {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
} {
  return {
    username: ssoUser[fieldMappings.username] || ssoUser.sub,
    email: ssoUser[fieldMappings.emailaddress] || ssoUser.email,
    firstName: ssoUser[fieldMappings.giventname] || ssoUser.given_name,
    lastName: ssoUser[fieldMappings.lastname] || ssoUser.family_name,
  };
}