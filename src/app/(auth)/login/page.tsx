import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Masuk | BangRajan Muaythai',
  description: 'Masuk ke akun member BangRajan Muaythai',
};

export default function LoginPage() {
  return <LoginForm />;
}
