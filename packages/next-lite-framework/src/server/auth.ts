import { NextApiRequest, NextApiResponse, NextMiddleware } from '../types';
import { createMiddleware } from './middleware';

// Session interface
export interface Session {
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    [key: string]: any;
  };
  expires: string;
  [key: string]: any;
}

// Auth options
export interface AuthOptions {
  providers?: AuthProvider[];
  callbacks?: {
    signIn?: (user: any, account: any, profile: any) => Promise<boolean>;
    redirect?: (url: string, baseUrl: string) => Promise<string>;
    session?: (session: Session, user: any) => Promise<Session>;
    jwt?: (token: any, user: any, account: any, profile: any, isNewUser: boolean) => Promise<any>;
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
    verifyRequest?: string;
    newUser?: string;
  };
  secret?: string;
  session?: {
    jwt?: boolean;
    maxAge?: number;
    updateAge?: number;
  };
  jwt?: {
    secret?: string;
    maxAge?: number;
    encryption?: boolean;
  };
  cookies?: {
    sessionToken?: {
      name?: string;
      options?: {
        httpOnly?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        path?: string;
        secure?: boolean;
        maxAge?: number;
      };
    };
  };
}

// Auth provider
export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'email' | 'credentials';
  version?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  profileUrl?: string;
  profile?: (profile: any) => any;
  authorize?: (credentials: any) => Promise<any>;
  [key: string]: any;
}

// Auth context
let authOptions: AuthOptions | null = null;

/**
 * Initialize authentication
 */
export function initAuth(options: AuthOptions): void {
  authOptions = options;
}

/**
 * Get session from request
 */
export async function getSession(req: NextApiRequest): Promise<Session | null> {
  // Get session token from cookies
  const sessionToken = req.cookies['next-lite-auth.session-token'];
  
  if (!sessionToken) {
    return null;
  }
  
  try {
    // In a real implementation, this would verify the session token
    // and retrieve the session from a database or JWT
    
    // For now, just return a mock session
    return {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user from request
 */
export async function getUser(req: NextApiRequest): Promise<any> {
  const session = await getSession(req);
  return session?.user || null;
}

/**
 * Sign in user
 */
export async function signIn(
  provider: string,
  credentials?: any
): Promise<{ user: any; session: Session } | null> {
  if (!authOptions) {
    throw new Error('Auth not initialized. Call initAuth() first.');
  }
  
  // Find provider
  const authProvider = authOptions.providers?.find(p => p.id === provider);
  
  if (!authProvider) {
    throw new Error(`Provider ${provider} not found`);
  }
  
  // Handle different provider types
  if (authProvider.type === 'credentials') {
    if (!authProvider.authorize) {
      throw new Error(`Provider ${provider} does not have an authorize function`);
    }
    
    // Authorize user
    const user = await authProvider.authorize(credentials);
    
    if (!user) {
      return null;
    }
    
    // Create session
    const session: Session = {
      user,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    // Call signIn callback
    if (authOptions.callbacks?.signIn) {
      const isAllowed = await authOptions.callbacks.signIn(user, null, null);
      
      if (!isAllowed) {
        return null;
      }
    }
    
    // Call session callback
    if (authOptions.callbacks?.session) {
      const newSession = await authOptions.callbacks.session(session, user);
      return { user, session: newSession };
    }
    
    return { user, session };
  }
  
  // For OAuth and Email providers, this would redirect to the provider's auth page
  // or send an email with a sign-in link
  // For now, just throw an error
  throw new Error(`Provider type ${authProvider.type} not implemented`);
}

/**
 * Sign out user
 */
export async function signOut(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  // Clear session cookie
  res.setHeader('Set-Cookie', [
    `next-lite-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`
  ]);
}

/**
 * Middleware to protect routes
 */
export function withAuth(options: {
  redirectTo?: string;
  allowedRoles?: string[];
}): NextMiddleware {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    // Get session
    const session = await getSession(req);
    
    // Check if user is authenticated
    if (!session?.user) {
      if (options.redirectTo) {
        // Redirect to login page
        res.writeHead(302, { Location: options.redirectTo });
        res.end();
        return;
      }
      
      // Return unauthorized
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Check roles if specified
    if (options.allowedRoles && options.allowedRoles.length > 0) {
      const userRole = session.user.role;
      
      if (!userRole || !options.allowedRoles.includes(userRole)) {
        // Return forbidden
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
    }
    
    // Continue
    next();
  };
}

/**
 * Create authentication middleware chain
 */
export function createAuthMiddleware(options: {
  redirectTo?: string;
  allowedRoles?: string[];
}) {
  const middleware = createMiddleware();
  middleware.use(withAuth(options));
  return middleware;
}
