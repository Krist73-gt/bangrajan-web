'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, Plus, Trash2, Edit2, Image as ImageIcon, Calendar, DollarSign, X } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function WebsiteManagementPage() {
  const [activeTab, setActiveTab] = useState<'harga' | 'jadwal' | 'gallery'>('harga');

  const [prices, setPrices] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceForm, setPriceForm] = useState({ id: null, name: '', category: 'DEWASA', defaultSessions: 0, price: 0, validityDays: 30 });

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ id: null, title: '', imageUrl: '' });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgs, schs, gals] = await Promise.all([
        fetchApi('/packages'),
        fetchApi('/website/schedules'),
        fetchApi('/website/gallery'),
      ]);
      setPrices(pkgs || []);
      setSchedules(schs || []);
      setGalleries(gals || []);
    } catch (err) {
      console.error('Failed to load website data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Price Handlers ---
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (priceForm.id) {
        await fetchApi(`/packages/${priceForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: priceForm.name,
            category: priceForm.category,
            defaultSessions: Number(priceForm.defaultSessions),
            price: Number(priceForm.price),
            validityDays: Number(priceForm.validityDays)
          })
        });
      } else {
        await fetchApi('/packages', {
          method: 'POST',
          body: JSON.stringify({
            name: priceForm.name,
            category: priceForm.category,
            defaultSessions: Number(priceForm.defaultSessions),
            price: Number(priceForm.price),
            validityDays: Number(priceForm.validityDays)
          })
        });
      }
      setIsPriceModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan paket harga');
    }
  };

  const handleDeletePrice = async (id: number) => {
    if (confirm('Hapus paket ini?')) {
      try {
        await fetchApi(`/packages/${id}`, { method: 'DELETE' });
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Schedule Handlers ---
  const handleScheduleChange = (id: number, field: string, value: any) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSaveSchedules = async () => {
    try {
      await fetchApi('/website/schedules', {
        method: 'PUT',
        body: JSON.stringify(schedules.map(s => ({
          id: s.id,
          openTime: s.openTime,
          closeTime: s.closeTime,
          isHoliday: s.isHoliday
        })))
      });
      alert('Jadwal berhasil disimpan!');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan jadwal');
    }
  };

  // --- Gallery Handlers ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', galleryForm.title);
      if (galleryFile) {
        formData.append('file', galleryFile);
      }

      if (galleryForm.id) {
        // If updating without file, just use fetchApi
        if (!galleryFile) {
          await fetchApi(`/website/gallery/${galleryForm.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: galleryForm.title })
          });
        } else {
          // fetchApi handles FormData perfectly by omitting Content-Type
          await fetchApi(`/website/gallery/${galleryForm.id}`, {
            method: 'PATCH',
            body: formData
          });
        }
      } else {
        if (!galleryFile) {
          alert('Silakan pilih file gambar terlebih dahulu.');
          return;
        }
        await fetchApi('/website/gallery', {
          method: 'POST',
          body: formData
        });
      }
      setIsGalleryModalOpen(false);
      setGalleryFile(null);
      setGalleryPreview(null);
      loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menyimpan foto gallery');
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5 MB');
        return;
      }
      setGalleryFile(file);
      setGalleryPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (confirm('Hapus foto ini?')) {
      try {
        await fetchApi(`/website/gallery/${id}`, { method: 'DELETE' });
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            KELOLA WEBSITE
          </h1>
          <p className="text-[var(--text-secondary)]">Ubah konten Landing Page (Harga, Jadwal, Gallery) secara langsung.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab('harga')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'harga' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <DollarSign size={18} /> Kelola Harga
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'jadwal' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <Calendar size={18} /> Kelola Jadwal
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
            activeTab === 'gallery' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          <ImageIcon size={18} /> Kelola Gallery
        </button>
      </div>

      {/* Content Area */}
      <Card className="p-6">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">Memuat data...</div>
        ) : (
          <>
            {/* Harga Tab */}
            {activeTab === 'harga' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Daftar Paket Harga</h2>
                  <Button variant="outline" className="flex items-center gap-2 text-sm" onClick={() => {
                    setPriceForm({ id: null, name: '', category: 'DEWASA', defaultSessions: 0, price: 0, validityDays: 30 });
                    setIsPriceModalOpen(true);
                  }}>
                    <Plus size={16} /> Tambah Paket
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prices.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center group hover:border-[var(--accent)] transition-colors">
                      <div>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">{p.category}</span>
                        <p className="font-bold text-[var(--text-primary)]">{p.name} ({p.defaultSessions} Sesi)</p>
                        <p className="text-[var(--accent)] font-medium">Rp {p.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg" onClick={() => {
                          setPriceForm(p);
                          setIsPriceModalOpen(true);
                        }}><Edit2 size={16}/></button>
                        <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg" onClick={() => handleDeletePrice(p.id)}><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jadwal Tab */}
            {activeTab === 'jadwal' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Jadwal Latihan Mingguan</h2>
                </div>
                <div className="space-y-3">
                  {schedules.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[var(--accent)] transition-colors">
                      <div className="flex-1">
                        <p className="font-bold text-[var(--text-primary)] mb-2 uppercase">{s.dayName}</p>
                        <div className="flex gap-4 items-center">
                          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <input 
                              type="checkbox" 
                              checked={s.isHoliday} 
                              onChange={(e) => handleScheduleChange(s.id, 'isHoliday', e.target.checked)}
                              className="rounded border-[var(--border-color)] text-fight-500 focus:ring-fight-500"
                            /> Libur
                          </label>
                          {!s.isHoliday && (
                            <>
                              <input 
                                type="time" 
                                value={s.openTime || ''} 
                                onChange={(e) => handleScheduleChange(s.id, 'openTime', e.target.value)}
                                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-sm text-[var(--text-primary)]"
                              />
                              <span className="text-[var(--text-muted)]">-</span>
                              <input 
                                type="time" 
                                value={s.closeTime || ''} 
                                onChange={(e) => handleScheduleChange(s.id, 'closeTime', e.target.value)}
                                className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-sm text-[var(--text-primary)]"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end">
                  <Button variant="primary" className="flex items-center gap-2" onClick={handleSaveSchedules}>
                    <Save size={18} /> Simpan Jadwal
                  </Button>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Foto Gallery</h2>
                  <Button variant="outline" className="flex items-center gap-2 text-sm" onClick={() => {
                    setGalleryForm({ id: null, title: '', imageUrl: '' });
                    setIsGalleryModalOpen(true);
                  }}>
                    <Plus size={16} /> Tambah Foto
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.map((g) => (
                    <div key={g.id} className="group relative rounded-xl overflow-hidden border border-[var(--border-color)] aspect-video bg-[var(--bg-secondary)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-white font-bold text-sm mb-2">{g.title}</p>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors" onClick={() => {
                            setGalleryForm(g);
                            setIsGalleryModalOpen(true);
                          }}>Edit</button>
                          <button className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors" onClick={() => handleDeleteGallery(g.id)}>Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {galleries.length === 0 && (
                  <div className="mt-4 p-8 border border-dashed border-[var(--border-color)] rounded-xl text-center hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer" onClick={() => {
                    setGalleryForm({ id: null, title: '', imageUrl: '' });
                    setIsGalleryModalOpen(true);
                  }}>
                    <ImageIcon className="mx-auto text-[var(--text-muted)] mb-2" size={32} />
                    <p className="text-sm font-bold text-[var(--text-secondary)]">Klik di sini untuk menambah foto gallery</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Price Modal */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{priceForm.id ? 'Edit Paket' : 'Tambah Paket'}</h3>
              <button onClick={() => setIsPriceModalOpen(false)} className="text-[var(--text-muted)] hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSavePrice} className="space-y-4">
              <Input label="Nama Paket" required value={priceForm.name} onChange={(e) => setPriceForm({...priceForm, name: e.target.value})} />
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Kategori</label>
                <select value={priceForm.category} onChange={(e) => setPriceForm({...priceForm, category: e.target.value})} className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none">
                  <option value="PELAJAR">PELAJAR</option>
                  <option value="DEWASA">DEWASA</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
              </div>
              <Input type="number" label="Harga (Rp)" required value={priceForm.price.toString()} onChange={(e) => setPriceForm({...priceForm, price: Number(e.target.value)})} />
              <Input type="number" label="Jumlah Sesi" required value={priceForm.defaultSessions.toString()} onChange={(e) => setPriceForm({...priceForm, defaultSessions: Number(e.target.value)})} />
              <Input type="number" label="Masa Aktif (Hari)" required value={priceForm.validityDays.toString()} onChange={(e) => setPriceForm({...priceForm, validityDays: Number(e.target.value)})} />
              
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsPriceModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-[var(--bg-primary)] border border-[var(--border-color)] animate-fade-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{galleryForm.id ? 'Edit Foto Gallery' : 'Tambah Foto Gallery'}</h3>
              <button onClick={() => { setIsGalleryModalOpen(false); setGalleryFile(null); setGalleryPreview(null); }} className="text-[var(--text-muted)] hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveGallery} className="space-y-4">
              <Input label="Judul / Keterangan" required value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} />
              
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Upload Gambar</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleGalleryFileChange}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-[var(--text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:bg-amber-600 focus:outline-none"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Maksimal 5 MB (JPG, PNG, WEBP)</p>
              </div>

              {(galleryPreview || galleryForm.imageUrl) && (
                <div className="mt-4 border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-secondary)] flex justify-center">
                  <img 
                    src={galleryPreview || galleryForm.imageUrl} 
                    alt="Preview" 
                    className="max-h-48 object-contain"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsGalleryModalOpen(false); setGalleryFile(null); setGalleryPreview(null); }}>Batal</Button>
                <Button type="submit" variant="primary">Simpan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
