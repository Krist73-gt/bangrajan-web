'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Camera, Megaphone, BarChart3, LogOut, Menu, Bell } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useSession, signOut } from '@/lib/auth-client';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Smart Check-in', href: '/admin/check-in', icon: Camera },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Pengumuman', href: '/admin/announcements', icon: Megaphone },
  { name: 'Laporan', href: '/admin/reports', icon: BarChart3 },
  { name: 'Kelola Website', href: '/admin/website', icon: LayoutDashboard },
];

export default function AdminSidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();

  const { data: session } = useSession();

  useEffect(() => {
    import('@/lib/api').then(({ fetchApi }) => {
      Promise.all([
        fetchApi('/notifications', { cache: 'no-store' }).catch(() => []),
        fetchApi('/announcements', { cache: 'no-store' }).catch(() => [])
      ]).then(([dataNotif, dataAnn]) => {
        const notifs = dataNotif || [];
        const anns = dataAnn || [];
        const mappedAnns = anns.map((a: any) => ({
          id: `ann-${a.id}`,
          title: `Pengumuman: ${a.title}`,
          message: a.content,
          createdAt: a.createdAt,
          isRead: false
        }));
        
        const combined = [...mappedAnns, ...notifs].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(combined);
      });
    });
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setIsNotifOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🥊</span>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-wider leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="gold-text">ADMIN</span>
                <span className="text-[var(--text-primary)]"> PANEL</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-0.5">Bangrajan Muaythai</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-fight-500/15 text-fight-500'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border-color)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-fight-500 hover:bg-fight-500/10 transition-colors"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] lg:hidden transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto relative">
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <Bell size={20} />
                <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse transition-colors ${hasUnread ? 'bg-fight-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[var(--accent)]'}`} />
              </button>

              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-up">
                  <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="font-bold text-[var(--text-primary)]">Notifikasi & Pengumuman</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${hasUnread ? 'bg-fight-500/10 text-fight-500' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}>{unreadCount} Baru</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-[var(--text-muted)]">Belum ada notifikasi.</div>
                    ) : notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer ${!notif.isRead ? 'border-l-4 border-l-[var(--accent)]' : ''}`}>
                        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{notif.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{notif.message}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-2">
                          {new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-[var(--border-color)]">
                    <button onClick={handleMarkAllRead} className="text-xs text-[var(--text-secondary)] hover:text-fight-500 font-medium transition-colors">Tandai semua sudah dibaca</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-fight-500 to-fight-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {session?.user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)] leading-none">{session?.user?.name || 'Super Admin'}</p>
              <p className="text-xs text-fight-500 mt-1">{((session?.user as any)?.role) || 'Administrator'}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto relative">
          {/* Static Background Silhouette */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
              <Image
                src="/images/silhouettes/s1.png"
                alt="Muay Thai Background"
                fill
                className="object-cover mix-blend-luminosity dark:mix-blend-overlay opacity-5 dark:opacity-10"
                priority
              />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-fight-500/5 blur-[100px] pointer-events-none z-0" />
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
