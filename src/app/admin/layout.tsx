import AdminSidebarLayout from '@/components/admin/AdminSidebarLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebarLayout>{children}</AdminSidebarLayout>;
}
