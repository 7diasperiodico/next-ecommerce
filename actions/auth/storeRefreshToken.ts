   'use server'
  
   import { cookies } from 'next/headers';
 
   export default async function storeRefreshToken(token: string) {
     const cookie = await cookies();
 
     return cookie.set('refresh_token',token);
   }