import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Daftar Member | BangRajan Muaythai',
  description: 'Daftar menjadi member BangRajan Muaythai',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
