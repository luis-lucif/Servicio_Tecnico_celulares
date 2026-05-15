import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ConnectionTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Unknown error');
      }
    }
    testConnection();
  }, []);

  return (
    <div className="fixed top-20 right-4 z-[9999] p-4 rounded-lg shadow-lg bg-surface border border-outline-variant/30">
      <h3 className="font-label-md text-label-md text-on-surface mb-2 font-bold">Estado de Supabase</h3>
      {status === 'loading' && <span className="text-on-surface-variant text-sm">Conectando...</span>}
      {status === 'success' && <span className="text-[#16a34a] font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Conectado</span>}
      {status === 'error' && (
        <div className="text-[#dc2626] flex flex-col gap-1">
          <span className="font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> Error de conexión</span>
          <span className="text-sm font-normal">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
