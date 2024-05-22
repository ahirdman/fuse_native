//import type { Session, User } from '@supabase/supabase-js';
import { config } from 'config';
import { http, HttpResponse } from 'msw';

// const supaBaseUser: User = {
//   id: '123456',
//   app_metadata: {},
//
//   user_metadata: {},
//   aud: '123',
//   created_at: '2020-03-12',
// };
//
// const supabaseSession: Session = {
//   token_type: 'bearer',
//   access_token: 'hey',
//   refresh_token: 'hey',
//   expires_in: 3600,
//   user: supaBaseUser,
// };
//
// interface SuccessResponse {
//   data: {
//     user: User | null;
//     session: Session | null;
//   };
// }
//
// const tokenRes: SuccessResponse = {
//   data: {
//     session: supabaseSession,
//     user: supaBaseUser,
//   },
// };

export const handlers = [
  http.post('url', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${config.spotify.baseUrl}*`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
