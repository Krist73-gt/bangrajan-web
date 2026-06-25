'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Search, Plus, Edit2, History, Calendar as CalendarIcon, Minus, Trash2, ClipboardList } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const [newMember, setNewMember] = useState({ fullName: '', phone: '', packageId: '', expiryDate: '', remainingSessions: 0 });
  const [editMember, setEditMember] = useState({ fullName: '', phone: '' });
  const [renewPackageId, setRenewPackageId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersRes, packagesRes] = await Promise.all([
        fetchApi(`/members?limit=100${searchTerm ? `&search=${searchTerm}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`),
        fetchApi('/packages')
      ]);
      setMembers(membersRes.data || []);
      setPackages(packagesRes || []);
    } catch (err) {
      console.error('Failed to load members or packages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  // Filtered members (already filtered from API mostly, but just in case)
  const filteredMembers = members;

  // Handle Edit Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi(`/members/${selectedMember.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editMember)
      });
      setIsEditModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to update member', err);
    }
  };

  // Handle Delete Member
  const handleDelete = async (member: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data member ${member.fullName}? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    setLoading(true);
    try {
      await fetchApi(`/members/${member.id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      console.error('Failed to delete member', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/members', {
        method: 'POST',
        body: JSON.stringify({
          fullName: newMember.fullName,
          phone: newMember.phone,
          packageId: parseInt(newMember.packageId),
          expiryDate: newMember.expiryDate,
          remainingSessions: newMember.remainingSessions
        })
      });
      setIsAddModalOpen(false);
      setNewMember({ fullName: '', phone: '', packageId: '', expiryDate: '', remainingSessions: 0 });
      loadData();
    } catch (err) {
      console.error('Failed to create member', err);
    }
  };

  // Handle Renewal / Session Adjustment
  const handleRenewal = async (action: 'renew_package', amount: number) => {
    try {
      if (action === 'renew_package') {
        if (!renewPackageId) return;
        await fetchApi(`/members/${selectedMember.id}/renew`, {
          method: 'POST',
          body: JSON.stringify({ packageId: parseInt(renewPackageId) })
        });
      }
      setIsRenewalModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to adjust sessions', err);
    }
  };

  const getStatus = (m: any) => {
    const isExpired = new Date(m.expiryDate) < new Date();
    if (m.remainingSessions <= 0 || isExpired) return 'Expired';
    if (m.remainingSessions <= 2) return 'Warning';
    return 'Aktif';
  };

  const openEditModal = (m: any) => {
    setSelectedMember(m);
    setEditMember({ fullName: m.fullName || '', phone: m.phone || '' });
    setIsEditModalOpen(true);
  };

  const openRenewalModal = (m: any) => {
    setSelectedMember(m);
    setRenewPackageId(m.packageId?.toString() || '');
    setIsRenewalModalOpen(true);
  };

  const openHistoryModal = async (m: any) => {
    setSelectedMember(m);
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);
    setActivityHistory([]);
    try {
      const history = await fetchApi(`/members/${m.id}/activity`);
      setActivityHistory(history || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            DATA MEMBER
          </h1>
          <p className="text-[var(--text-secondary)]">Kelola daftar member, paket, dan sesi latihan.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Tambah Member
        </Button>
      </div>

      <Card className="p-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border-color)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--bg-elevated)] rounded-t-2xl">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama member..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-fight-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2 px-4 text-sm text-[var(--text-primary)] focus:outline-none flex-1 sm:flex-none"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Pending">Pending</option>
              <option value="Warning">Warning</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm">
                <th className="p-4 font-medium">Member ID</th>
                <th className="p-4 font-medium">Nama Member</th>
                <th className="p-4 font-medium">No. Telepon</th>
                <th className="p-4 font-medium">Paket</th>
                <th className="p-4 font-medium text-center">Sisa Sesi</th>
                <th className="p-4 font-medium">Expiry Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[var(--text-muted)]">Memuat data...</td>
                </tr>
              ) : filteredMembers.map((member) => {
                const status = getStatus(member);
                return (
                  <tr key={member.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="p-4 font-mono text-xs text-[var(--text-secondary)]">{member.memberId || '-'}</td>
                    <td className="p-4 font-medium text-[var(--text-primary)]">{member.fullName || '-'}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{member.phone || '-'}</td>
                    <td className="p-4 text-[var(--text-secondary)]">{member.packageName || '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex justify-center items-center w-8 h-8 rounded-full font-bold ${
                        member.remainingSessions > 2 ? 'bg-emerald-500/10 text-emerald-500' :
                        member.remainingSessions > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-fight-500/10 text-fight-500'
                      }`}>
                        {member.remainingSessions}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">{new Date(member.expiryDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Badge variant={
                        status === 'Aktif' ? 'success' : 
                        status === 'Warning' ? 'warning' : 'danger'
                      }>
                        {status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openHistoryModal(member)}
                          className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                          title="Riwayat Aktivitas"
                        >
                          <ClipboardList size={16} />
                        </button>
                        <button 
                          onClick={() => openRenewalModal(member)}
                          className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                          title="Perpanjang / Sesuaikan Sesi"
                        >
                          <History size={16} />
                        </button>
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                          title="Edit Data"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Hapus Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[var(--text-muted)]">
                    Tidak ada data member ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Edit Profil Member</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editMember.fullName} 
                  onChange={(e) => setEditMember({...editMember, fullName: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">No WhatsApp</label>
                <input 
                  type="text" 
                  value={editMember.phone} 
                  onChange={(e) => setEditMember({...editMember, phone: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan Profil</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Tambah Member Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={newMember.fullName} 
                  onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">No WhatsApp</label>
                <input 
                  type="text" 
                  value={newMember.phone} 
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Pilih Paket Awal</label>
                <select 
                  value={newMember.packageId}
                  onChange={(e) => {
                    const pkgId = e.target.value;
                    const pkg = packages.find(p => p.id.toString() === pkgId);
                    setNewMember({...newMember, packageId: pkgId, remainingSessions: pkg ? pkg.defaultSessions : 0});
                  }}
                  required
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                >
                  <option value="" disabled>Pilih paket...</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.defaultSessions} Sesi)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={newMember.expiryDate}
                  onChange={(e) => setNewMember({...newMember, expiryDate: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-fight-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Tambah Member</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Renewal Modal */}
      {isRenewalModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Sesi & Perpanjangan</h3>
              <button onClick={() => setIsRenewalModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">✕</button>
            </div>
            
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <p className="text-sm text-[var(--text-secondary)]">Member: <strong className="text-[var(--text-primary)]">{selectedMember.fullName || selectedMember.memberId}</strong></p>
              <p className="text-sm text-[var(--text-secondary)]">Paket Saat Ini: <strong className="text-[var(--accent)]">{selectedMember.packageName}</strong></p>
              <div className="flex gap-4 mt-2 pt-2 border-t border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)]">Sisa Sesi: <strong className="text-[var(--text-primary)]">{selectedMember.remainingSessions}</strong></p>
                <p className="text-sm text-[var(--text-secondary)]">Expired: <strong className="text-[var(--text-primary)]">{new Date(selectedMember.expiryDate).toLocaleDateString()}</strong></p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]">
                <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase">Pilih Paket Perpanjangan</label>
                    <select 
                      value={renewPackageId}
                      onChange={(e) => setRenewPackageId(e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] focus:border-fight-500 focus:outline-none font-medium"
                    >
                      <option value="">Pilih Paket Baru...</option>
                      {packages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (+{p.defaultSessions} Sesi)</option>
                      ))}
                    </select>
                  </div>
                  <Button 
                    variant="primary" 
                    className="flex items-center justify-center gap-2 h-[46px]"
                    onClick={() => handleRenewal('renew_package', 0)}
                    disabled={!renewPackageId}
                  >
                    <CalendarIcon size={18} /> Perpanjang Paket
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setIsRenewalModalOpen(false)}>Tutup</Button>
            </div>
          </Card>
        </div>
      )}

      {/* History / Audit Log Modal */}
      {isHistoryModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] max-h-[90vh] flex flex-col animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Aktivitas</h3>
                <p className="text-sm text-[var(--text-secondary)]">{selectedMember.fullName}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {isLoadingHistory ? (
                <div className="text-center py-8 text-[var(--text-muted)]">Memuat riwayat...</div>
              ) : activityHistory.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-xl">
                  Belum ada catatan aktivitas.
                </div>
              ) : (
                <div className="relative border-l-2 border-[var(--border-color)] ml-3 pl-6 space-y-6">
                  {activityHistory.map((item, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-[var(--bg-primary)] ${
                        item.type === 'checkin' ? (item.action === 'Berhasil' ? 'bg-emerald-500' : 'bg-fight-500') : 'bg-blue-500'
                      }`} />
                      
                      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-sm font-bold ${
                            item.type === 'checkin' ? (item.action === 'Berhasil' ? 'text-emerald-500' : 'text-fight-500') : 'text-blue-500'
                          }`}>
                            {item.type === 'checkin' ? `Check-in ${item.action}` : 
                              item.action === 'renew' ? 'Perpanjang Paket' : 
                              item.action === 'add_session' ? 'Tambah Sesi Manual' : 'Kurangi Sesi Manual'}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)] mb-1">
                          {item.description || '-'}
                        </p>
                        {item.createdBy && (
                          <p className="text-xs text-[var(--text-secondary)] italic">Oleh: {item.createdBy}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-end mt-2">
              <Button type="button" variant="outline" onClick={() => setIsHistoryModalOpen(false)}>Tutup</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
