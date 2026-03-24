'use server';

import { redirect } from 'next/navigation';
import { setAdminSession, clearAdminSession } from '@/lib/admin-auth';

export async function loginAction(_prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return { error: 'Contraseña incorrecta' };
  }

  await setAdminSession();
  redirect('/admin');
}

export async function logoutAction() {
  await clearAdminSession();
  redirect('/admin/login');
}
