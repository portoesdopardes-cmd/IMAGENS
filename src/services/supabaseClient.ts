const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: { id: string; email?: string };
};

function headers(token?: string): HeadersInit {
  return {
    apikey: supabaseAnonKey ?? '',
    Authorization: `Bearer ${token ?? supabaseAnonKey ?? ''}`,
    'Content-Type': 'application/json',
  };
}

export const supabaseRest = {
  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`Supabase login failed: ${response.status}`);
    }
    return response.json() as Promise<AuthResponse>;
  },

  async signUp(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`Supabase signup failed: ${response.status}`);
    }
    return response.json() as Promise<AuthResponse>;
  },

  async getUser(accessToken: string): Promise<{ id: string } | null> {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: headers(accessToken),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { id: string };
    return data;
  },

  async selectSingle<T>(table: string, filter: string, accessToken: string): Promise<T | null> {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
      headers: { ...headers(accessToken), Accept: 'application/vnd.pgrst.object+json' },
    });
    if (!response.ok) return null;
    return response.json() as Promise<T>;
  },

  async upsert<T extends object>(table: string, row: T, accessToken: string): Promise<void> {
    await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        ...headers(accessToken),
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(row),
    });
  },
};
