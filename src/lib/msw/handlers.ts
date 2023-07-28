import { rest } from 'msw';

import { config } from '@/config/index';

import type { Session, User } from '@supabase/supabase-js';

const supaBaseUser: User = {
  id: '123456',
  app_metadata: {},
  user_metadata: {},
  aud: '123',
  created_at: '2020-03-12',
};

const supabaseSession: Session = {
  token_type: 'bearer',
  access_token: 'hey',
  refresh_token: 'hey',
  expires_in: 3600,
  user: supaBaseUser,
};

interface SuccessResponse {
  data: {
    user: User | null;
    session: Session | null;
  };
}

const tokenRes: SuccessResponse = {
  data: {
    session: supabaseSession,
    user: supaBaseUser,
  },
};

export const handlers = [
  rest.post(`${config.supabase.url}/auth/v1/token`, async (_, res, ctx) => {
    return res(ctx.json(tokenRes));
  }),
];
