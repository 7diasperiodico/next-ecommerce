  'use server'
 
  import { cookies } from 'next/headers';

  export default async function retrieveRefreshToken() {
    const cookie = await cookies();

    return cookie.get('refresh_token')?.value;
  }