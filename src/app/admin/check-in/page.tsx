'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Camera, CheckCircle2, XCircle, AlertCircle, ScanLine, Keyboard } from 'lucide-react';
import { fetchApi } from '@/lib/api';

type ScanStatus = 'idle' | 'success' | 'error';

interface ScanResult {
  name: string;
  plan: string;
  sessions: { old: number; new: number };
  expiry: string;
  message?: string;
}

export default function CheckInPage() {
  const [barcode, setBarcode] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [mode, setMode] = useState<'scanner' | 'manual'>('scanner');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isProcessingRef = useRef(false);
  const lastScannedCodeRef = useRef('');
  const lastScanTimeRef = useRef(0);

  const processScanCode = async (codeStr: string) => {
    const now = Date.now();
    if (!codeStr.trim() || isProcessingRef.current) return;

    // Mencegah kamera mengirim hasil scan yang sama berkali-kali sebelum kamera benar-benar mati (Debounce 3 detik)
    if (mode === 'scanner' && lastScannedCodeRef.current === codeStr && now - lastScanTimeRef.current < 3000) {
      return;
    }

    lastScannedCodeRef.current = codeStr;
    lastScanTimeRef.current = now;

    isProcessingRef.current = true;
    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetchApi('/checkins/scan', {
        method: 'POST',
        body: JSON.stringify({ memberId: codeStr })
      });

      if (response && response.success) {
        setStatus('success');
        setResult({
          name: response.name || '-',
          plan: response.plan || '-',
          sessions: response.sessions || { old: 0, new: 0 },
          expiry: response.expiry ? new Date(response.expiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
        });
        playBeep(true);
      } else if (response && response.success === false) {
        // Handle logic rejection (e.g., expired, no sessions)
        setStatus('error');
        setResult({
          name: response.name || 'Member Tidak Dikenal',
          plan: response.plan || 'Expired / Tidak Ada',
          sessions: response.sessions || { old: 0, new: 0 },
          expiry: response.expiry ? new Date(response.expiry).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-',
          message: response.message || 'Gagal check-in',
        });
        playBeep(false);
      } else {
        throw new Error('Gagal terhubung ke server');
      }
    } catch (err: any) {
      // Handle network errors or pure server crashes
      setStatus('error');
      setResult({
        name: 'Sistem Error',
        plan: '-',
        sessions: { old: 0, new: 0 },
        expiry: '-',
        message: err.message || 'Terjadi kesalahan pada sistem.',
      });
      playBeep(false);
    } finally {
      setIsLoading(false);
      setBarcode('');
      isProcessingRef.current = false;
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await processScanCode(barcode);
  };

  // Camera Scanner logic
  useEffect(() => {
    if (mode === 'scanner' && status === 'idle') {
      let isCleaningUp = false;
      const html5QrCode = new Html5Qrcode("reader", {
        formatsToSupport: [
           Html5QrcodeSupportedFormats.QR_CODE // Hanya memindai QR Code membuat proses jauh lebih cepat
        ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true // Gunakan Native API browser jika ada
        },
        verbose: false
      });
      
      html5QrCode.start(
        { facingMode: "environment" },
        { 
          fps: 30, // Tingkatkan frame per second agar lebih responsif
          qrbox: { width: 250, height: 250 }, // Hanya memindai kotak tengah (menghemat CPU)
          aspectRatio: 1.0
        },
        (decodedText) => {
          processScanCode(decodedText);
        },
        () => { } // ignore
      ).then(() => {
        // Jika status sudah berubah ke bukan idle (komponen ter-unmount) selama proses start, matikan segera
        if (isCleaningUp) {
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
        }
      }).catch((err) => {
        console.error("Camera error:", err);
      });

      return () => {
        isCleaningUp = true;
        if (html5QrCode.isScanning) {
          html5QrCode.stop()
            .then(() => html5QrCode.clear())
            .catch(() => {});
        } else {
          // It might be paused or starting, clear the UI just in case
          try { html5QrCode.clear(); } catch(e) {}
        }
      };
    }
  }, [mode, status]);

  const playBeep = (success: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = success ? 'sine' : 'sawtooth';
      osc.frequency.value = success ? 1000 : 300;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + (success ? 0.1 : 0.3));
    } catch (e) {
      // Ignore audio errors
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="text-center mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide mb-2 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
          SMART CHECK-IN <ScanLine className="text-fight-500 animate-pulse" />
        </h1>
        <p className="text-[var(--text-secondary)]">Arahkan scanner ke barcode member atau ketik manual.</p>
        
        {/* Mode Toggle */}
        <div className="mt-4 flex bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-color)]">
          <button 
            onClick={() => setMode('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'scanner' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <Camera size={16} /> Mode Scanner
          </button>
          <button 
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'manual' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <Keyboard size={16} /> Input Manual
          </button>
        </div>
      </div>

      <Card className="p-8 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 diagonal-stripes opacity-30 pointer-events-none" />
        
        {mode === 'scanner' ? (
          <div className="relative z-10 max-w-sm mx-auto text-center">
            {/* Camera Scanner UI */}
            <div className="w-full aspect-[4/3] sm:aspect-video border-2 border-solid border-[var(--border-color)] rounded-2xl flex items-center justify-center relative overflow-hidden mb-4 bg-black">
              <div id="reader" className={`absolute inset-0 w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full transition-all duration-300 ${status !== 'idle' ? 'opacity-30 blur-sm' : 'opacity-100'}`} style={{ border: 'none' }}></div>
              
              {/* Overlay Feedback Langsung di atas Kamera */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                {status === 'success' && result ? (
                  <div className="bg-emerald-500/90 text-white p-6 rounded-full shadow-2xl flex items-center justify-center animate-punch-in backdrop-blur-md">
                    <CheckCircle2 size={80} />
                  </div>
                ) : status === 'error' && result ? (
                  <div className="bg-fight-500/90 text-white p-6 rounded-full shadow-2xl flex items-center justify-center animate-punch-in backdrop-blur-md">
                    <XCircle size={80} />
                  </div>
                ) : (
                  <>
                    <div className="absolute w-full h-1 bg-fight-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_1.5s_ease-in-out_infinite]" />
                    <div className="absolute top-[25%] left-[15%] w-8 h-8 border-t-4 border-l-4 border-fight-500 rounded-tl-lg" />
                    <div className="absolute top-[25%] right-[15%] w-8 h-8 border-t-4 border-r-4 border-fight-500 rounded-tr-lg" />
                    <div className="absolute bottom-[25%] left-[15%] w-8 h-8 border-b-4 border-l-4 border-fight-500 rounded-bl-lg" />
                    <div className="absolute bottom-[25%] right-[15%] w-8 h-8 border-b-4 border-r-4 border-fight-500 rounded-br-lg" />
                  </>
                )}
              </div>
            </div>
            {status === 'idle' ? (
              <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Scanner Aktif. Siap memindai.
              </p>
            ) : status === 'success' ? (
              <button 
                onClick={() => setStatus('idle')} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-bold text-lg transition-colors shadow-lg mt-2"
              >
                Scan Berikutnya
              </button>
            ) : (
              <button 
                onClick={() => setStatus('idle')} 
                className="w-full bg-fight-500 hover:bg-fight-600 text-white rounded-xl py-3 font-bold text-lg transition-colors shadow-lg mt-2"
              >
                Coba Lagi
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleScan} className="relative z-10 max-w-sm mx-auto">
            <Input
              type="text"
              placeholder="Ketik ID Member (Contoh: BR-...)"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="text-center font-mono text-lg py-4 border-[var(--accent)] shadow-inner"
              autoFocus
              disabled={isLoading}
            />
            <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isLoading}>Proses Check-in</Button>
          </form>
        )}
      </Card>

      {/* Result Area */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center mb-6">
          <div className="w-full border-t border-[var(--border-color)]" />
        </div>
        <div className="relative flex justify-center text-sm mb-6">
          <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-muted)] tracking-widest uppercase">Hasil Scan Terakhir</span>
        </div>

        {status === 'idle' && (
          <div className="text-center p-8 text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-2xl">
            Belum ada data scan terbaru.
          </div>
        )}

        {status === 'success' && result && (
          <Card className="p-6 border-emerald-500 bg-emerald-500/5 animate-punch-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-500 text-white p-3 rounded-full shrink-0 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-500">ABSEN BERHASIL</h3>
                <p className="text-[var(--text-primary)] font-medium text-lg">{result.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Paket</p>
                <p className="font-medium text-[var(--text-primary)]">{result.plan}</p>
              </div>
              <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Expiry</p>
                <p className="font-medium text-[var(--text-primary)]">{result.expiry}</p>
              </div>
              <div className="col-span-2 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex justify-between items-center">
                <p className="font-semibold text-emerald-500">Sesi Berkurang</p>
                <p className="font-bold text-xl text-emerald-600">
                  {result.sessions.old} <span className="text-emerald-500/50">→</span> {result.sessions.new}
                </p>
              </div>
            </div>
          </Card>
        )}

        {status === 'error' && result && (
          <Card className="p-6 border-fight-500 bg-fight-500/5 animate-punch-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-fight-500 text-white p-3 rounded-full shrink-0 shadow-lg shadow-fight-500/30">
                <XCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-fight-500">GAGAL</h3>
                <p className="text-[var(--text-primary)] font-medium text-lg">{result.name}</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-fight-500/10 border border-fight-500/20 rounded-xl flex gap-3">
              <AlertCircle className="text-fight-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-fight-500 font-semibold mb-1">Akses Ditolak</p>
                <p className="text-sm text-fight-500/80">{result.message}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
