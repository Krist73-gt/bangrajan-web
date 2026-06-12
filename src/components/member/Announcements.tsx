'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Megaphone, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/announcements', { cache: 'no-store' }).then(data => {
      setAnnouncements(data || []);
    }).catch(err => {
      console.error('Failed to fetch announcements', err);
    });
  }, []);

  return (
    <div className="space-y-4">
      {announcements.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] italic">Tidak ada pengumuman.</p>
      )}
      {announcements.map((item) => (
        <button 
          key={item.id} 
          className="w-full text-left transition-transform active:scale-[0.98] focus:outline-none"
          onClick={() => alert(`Detail:\n\n${item.content}`)}
        >
          <Card className="p-5 flex gap-4 items-start relative overflow-hidden" hover>
            {/* Unread indicator */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            
            <div className={`
              p-3 rounded-xl shrink-0 mt-1
              ${item.type?.toUpperCase() === 'PROMO' 
                ? 'bg-[var(--accent-light)] text-[var(--accent)]' 
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}
            `}>
              {item.type?.toUpperCase() === 'PROMO' ? <Tag size={20} /> : <CalendarIcon size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-[var(--text-primary)]">{item.title}</h4>
                {item.type?.toUpperCase() === 'PROMO' && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-fight-500 text-white rounded-full">
                    Promo
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                {item.content}
              </p>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
