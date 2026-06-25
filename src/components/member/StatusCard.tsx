import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Calendar, AlertCircle } from 'lucide-react';

export default function StatusCard({ stats }: { stats: any }) {
  if (!stats) return null;

  const sessionsTotal = stats.totalSessions || 0;
  const sessionsLeft = stats.remainingSessions || 0;
  const sessionsUsed = Math.max(0, sessionsTotal - sessionsLeft);
  const percentage = sessionsTotal > 0 ? (sessionsUsed / sessionsTotal) * 100 : 0;
  
  // Expiry Logic
  const expiryDate = new Date(stats.expiryDate);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  
  const isWarning = daysLeft <= 3 || sessionsLeft <= 2;

  return (
    <Card className="p-6 relative overflow-hidden" glow={isWarning}>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Status Membership</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold border border-[var(--accent)]/20 uppercase tracking-wider">
            {stats.packageName}
          </span>
        </div>
        <Badge variant={isWarning ? 'warning' : 'success'}>
          {isWarning ? 'Segera Habis' : 'Aktif'}
        </Badge>
      </div>

      {isWarning && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500 text-amber-950 flex items-start gap-3 shadow-lg shadow-amber-500/20 animate-pulse-slow">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold uppercase tracking-tight">Perhatian!</p>
            <p className="mt-1 font-medium leading-relaxed">
              Paket kamu akan habis dalam <span className="font-black bg-amber-950/10 px-1 rounded">{daysLeft} hari</span> atau <span className="font-black bg-amber-950/10 px-1 rounded">{sessionsLeft} sesi</span>. Segera perpanjang agar latihan tetap lancar!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6 relative z-10">
        {/* Sessions Progress */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Sisa Sesi</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium tracking-wide">💡 1 SESI = LATIHAN 2 JAM</p>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {sessionsLeft} <span className="text-sm font-normal text-[var(--text-muted)]">/ {sessionsTotal}</span>
            </p>
          </div>
          <div className="h-2 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isWarning ? 'bg-amber-500' : 'bg-[var(--accent)]'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
          <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-500/10 text-amber-500' : 'bg-[var(--accent-light)] text-[var(--accent)]'}`}>
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">Berlaku Sampai</p>
            <p className="font-semibold text-[var(--text-primary)]">{expiryDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
