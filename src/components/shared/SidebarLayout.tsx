'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, IdCard, LogOut, Menu, X, Bell } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useSession, signOut } from '@/lib/auth-client';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Log Latihan', href: '/training-log', icon: FileText },
  { name: 'Kartu Member', href: '/member-card', icon: IdCard },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  
  const { data: session, isPending } = useSession();

  // For Edit Profile
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // For Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (session?.user) {
      setEditName(session.user.name || '');
      setEditPhone((session.user as any).phone || '');
    }
  }, [session]);

  useEffect(() => {
    // We import fetchApi inline or from lib/api, wait I need to import fetchApi
    import('@/lib/api').then(({ fetchApi }) => {
      fetchApi('/notifications', { cache: 'no-store' })
        .then(data => setNotifications(data || []))
        .catch(err => console.error('Failed to load notifications', err));
    });
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
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
                <span className="gold-text">DASHBOARD</span>
                <span className="text-[var(--text-primary)]"> MEMBER</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase mt-0.5">Bangrajan Muaythai</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-[var(--accent-light)] text-[var(--accent)]'
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] lg:hidden transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto relative">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fight-500 animate-pulse" />
              </button>
              
              {/* Notifications Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-up">
                  <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="font-bold text-[var(--text-primary)]">Notifikasi</h3>
                    <span className="text-xs bg-fight-500/10 text-fight-500 px-2 py-1 rounded-full font-bold">{notifications.filter(n => !n.isRead).length} Baru</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-[var(--text-muted)]">Belum ada notifikasi.</div>
                    ) : notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer ${!notif.isRead ? 'border-l-4 border-l-fight-500' : ''}`}>
                        <p className="text-sm font-bold text-[var(--text-primary)] mb-1">{notif.title}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{notif.message}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-2">
                          {new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-[var(--border-color)]">
                    <button className="text-xs text-[var(--accent)] hover:text-fight-500 font-medium transition-colors">Tandai semua sudah dibaca</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                className="flex items-center gap-3 hover:bg-[var(--bg-elevated)] p-1.5 pr-3 rounded-full transition-colors text-left"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-hover)] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-none">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">Member</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-up">
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-bold text-[var(--text-primary)]">{session?.user?.name || 'Member'}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{session?.user?.email || 'email@contoh.com'}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => { setIsEditProfileModalOpen(true); setIsProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] rounded-xl transition-colors"
                    >
                      Edit Profil
                    </button>
                    <button 
                      onClick={() => { setIsChangePasswordModalOpen(true); setIsProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] rounded-xl transition-colors"
                    >
                      Ubah Password
                    </button>
                  </div>
                  <div className="p-2 border-t border-[var(--border-color)]">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-fight-500 hover:bg-fight-500/10 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto relative">
          {/* Static Background Silhouette */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-100">
              <Image
                src="/images/silhouettes/s2.png"
                alt="Muay Thai Background"
                fill
                className="object-cover mix-blend-luminosity dark:mix-blend-overlay opacity-5 dark:opacity-10"
                priority
              />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--accent)]/5 blur-[100px] pointer-events-none z-0" />
          <div className="relative z-10 max-w-6xl mx-auto">
            {children}
          </div>

          {/* Simple Modals */}
          {isEditProfileModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-sm p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl animate-fade-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[var(--text-primary)]">Edit Profil</h3>
                  <button onClick={() => setIsEditProfileModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-fight-500 focus:outline-none text-[var(--text-primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Email (Tidak dapat diubah)</label>
                    <input 
                      type="email" 
                      value={session?.user?.email || ''} 
                      disabled
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm opacity-50 cursor-not-allowed text-[var(--text-primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">No. WhatsApp</label>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-fight-500 focus:outline-none text-[var(--text-primary)]" 
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      disabled={isLoadingProfile}
                      onClick={async () => {
                        setIsLoadingProfile(true);
                        try {
                          const { authClient } = await import('@/lib/auth-client');
                          await authClient.updateUser({
                            name: editName,
                            image: editPhone // Note: Better Auth uses predefined fields
                          } as any);
                          alert('Profil berhasil diperbarui!');
                          setIsEditProfileModalOpen(false);
                          window.location.reload();
                        } catch (err) {
                          alert('Gagal memperbarui profil');
                        } finally {
                          setIsLoadingProfile(false);
                        }
                      }} 
                      className="w-full bg-[var(--accent)] text-white font-medium py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                    >
                      {isLoadingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isChangePasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-sm p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-xl animate-fade-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[var(--text-primary)]">Ubah Password</h3>
                  <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Password Saat Ini</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-fight-500 focus:outline-none text-[var(--text-primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Password Baru</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-fight-500 focus:outline-none text-[var(--text-primary)]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-secondary)] mb-1">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm focus:border-fight-500 focus:outline-none text-[var(--text-primary)]" 
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      disabled={isLoadingProfile}
                      onClick={async () => {
                        if (newPassword !== confirmPassword) {
                          alert('Password baru dan konfirmasi tidak cocok!');
                          return;
                        }
                        setIsLoadingProfile(true);
                        try {
                          const authMod = await import('@/lib/auth-client') as any;
                          const doChangePassword = authMod.changePassword || (authMod.authClient?.changePassword);
                          
                          if (!doChangePassword) {
                            throw new Error('Fungsi ubah password belum diimplementasikan.');
                          }

                          const { error } = await doChangePassword({
                            newPassword,
                            currentPassword,
                            revokeOtherSessions: true
                          });
                          if (error) throw new Error(error.message);
                          alert('Password berhasil diperbarui!');
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setIsChangePasswordModalOpen(false);
                        } catch (err: any) {
                          alert('Gagal memperbarui password: ' + err.message);
                        } finally {
                          setIsLoadingProfile(false);
                        }
                      }}
                      className="w-full bg-[var(--accent)] text-white font-medium py-3 rounded-xl hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                    >
                      {isLoadingProfile ? 'Menyimpan...' : 'Perbarui Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
