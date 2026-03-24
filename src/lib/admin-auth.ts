import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

export async function getAdminSession(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  if (!expected) return false;
  return token === expected;
}

export async function setAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, process.env.ADMIN_SESSION_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
