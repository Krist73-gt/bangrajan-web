import SidebarLayout from '@/components/shared/SidebarLayout';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
