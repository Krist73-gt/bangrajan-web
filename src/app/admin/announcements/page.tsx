'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Megaphone, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

type Announcement = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  type: 'INFO' | 'PROMO' | string;
};

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'INFO' });
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/announcements');
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'INFO' });
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return alert('Judul dan isi harus diisi!');

    try {
      if (editingId) {
        await fetchApi(`/announcements/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
      } else {
        await fetchApi('/announcements', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      resetForm();
      loadAnnouncements();
    } catch (err) {
      console.error('Failed to save announcement', err);
      alert('Gagal menyimpan pengumuman.');
    }
  };

  const handleEdit = (a: Announcement) => {
    setFormData({ title: a.title, content: a.content, type: a.type });
    setEditingId(a.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus pengumuman ini?')) {
      try {
        await fetchApi(`/announcements/${id}`, { method: 'DELETE' });
        loadAnnouncements();
      } catch (err) {
        console.error('Failed to delete announcement', err);
        alert('Gagal menghapus pengumuman.');
      }
    }
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            PENGUMUMAN CAMP 📢
          </h1>
          <p className="text-[var(--text-secondary)]">Buat dan kelola informasi untuk member.</p>
        </div>
        {!isFormOpen && (
          <Button variant="primary" className="h-10" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} /> Buat Pengumuman
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="p-6 border-[var(--accent)] shadow-[var(--shadow-gold)] animate-fade-in">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {editingId ? 'Edit Pengumuman' : 'Pengumuman Baru'}
          </h3>
          <div className="space-y-4">
            <Input 
              label="Judul Pengumuman" 
              placeholder="Contoh: Promo Spesial!" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Jenis</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.type === 'INFO'} onChange={() => setFormData({...formData, type: 'INFO'})} className="text-[var(--accent)] bg-[var(--bg-elevated)] border-[var(--border-color)] focus:ring-[var(--accent)]" />
                  <span className="text-sm text-[var(--text-primary)]">Info Umum</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.type === 'PROMO'} onChange={() => setFormData({...formData, type: 'PROMO'})} className="text-fight-500 bg-[var(--bg-elevated)] border-[var(--border-color)] focus:ring-fight-500" />
                  <span className="text-sm text-[var(--text-primary)]">Promo</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Isi Pesan</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] transition-colors min-h-[100px] resize-y"
                placeholder="Ketik detail pengumuman di sini..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={resetForm}>Batal</Button>
              <Button variant="primary" onClick={handleSubmit}>
                {editingId ? 'Simpan Perubahan' : 'Publikasikan'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Pengumuman Aktif</h3>
        {loading && <p className="text-[var(--text-muted)] italic">Memuat pengumuman...</p>}
        {!loading && announcements.length === 0 && (
          <p className="text-[var(--text-muted)] italic">Belum ada pengumuman.</p>
        )}
        {announcements.map((item) => (
          <Card key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--bg-elevated)] rounded-xl text-[var(--text-secondary)]">
                <Megaphone size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-[var(--text-primary)]">{item.title}</h4>
                  {item.type === 'PROMO' && <Badge variant="danger" className="text-[10px]">PROMO</Badge>}
                </div>
                <p className="text-xs text-[var(--text-muted)]">Dipublikasikan: {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 border-t border-[var(--border-color)] sm:border-0 pt-3 sm:pt-0">
              <Button variant="ghost" size="sm" className="px-2" onClick={() => handleEdit(item)}>
                <Edit2 size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="text-fight-500 hover:text-fight-600 hover:bg-fight-500/10 px-2" onClick={() => handleDelete(item.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
