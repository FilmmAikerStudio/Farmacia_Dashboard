import React from 'react';
import { Wifi, WifiOff, RefreshCw, LogIn, LogOut, AlertCircle } from 'lucide-react';

interface Props {
  isMetaConnected: boolean;
  isGoogleConnected: boolean;
  isMetaLoading: boolean;
  isGoogleLoading: boolean;
  metaError: string | null;
  googleError: string | null;
  onSignInGoogle: () => void;
  onSignOutGoogle: () => void;
  onRefreshMeta: () => void;
  darkMode: boolean;
}

const ApiStatusBar: React.FC<Props> = ({
  isMetaConnected,
  isGoogleConnected,
  isMetaLoading,
  isGoogleLoading,
  metaError,
  googleError,
  onSignInGoogle,
  onSignOutGoogle,
  onRefreshMeta,
  darkMode,
}) => {
  const base = darkMode
    ? 'bg-slate-900/80 border-white/5 text-slate-300'
    : 'bg-white/80 border-slate-200 text-slate-600';

  return (
    <div
      className={`flex flex-wrap items-center gap-3 px-5 py-2.5 rounded-2xl border backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-6 ${base}`}
    >
      {/* Meta status */}
      <div className="flex items-center gap-1.5">
        {isMetaLoading ? (
          <RefreshCw size={12} className="animate-spin text-amber-400" />
        ) : isMetaConnected ? (
          <Wifi size={12} className="text-emerald-500" />
        ) : (
          <WifiOff size={12} className="text-rose-500" />
        )}
        <span className={isMetaConnected ? 'text-emerald-500' : isMetaLoading ? 'text-amber-400' : 'text-rose-500'}>
          Meta {isMetaLoading ? 'cargando…' : isMetaConnected ? 'live' : 'offline'}
        </span>
        {metaError && (
          <button
            title={metaError}
            className="text-rose-400 hover:text-rose-300"
          >
            <AlertCircle size={11} />
          </button>
        )}
        {!isMetaLoading && (
          <button
            onClick={onRefreshMeta}
            className="ml-1 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Actualizar datos de Meta"
          >
            <RefreshCw size={11} />
          </button>
        )}
      </div>

      <div className="w-px h-4 bg-current opacity-20" />

      {/* Google status */}
      <div className="flex items-center gap-1.5">
        {isGoogleLoading ? (
          <RefreshCw size={12} className="animate-spin text-amber-400" />
        ) : isGoogleConnected ? (
          <Wifi size={12} className="text-blue-500" />
        ) : (
          <WifiOff size={12} className="text-slate-400" />
        )}
        <span className={isGoogleConnected ? 'text-blue-500' : isGoogleLoading ? 'text-amber-400' : 'text-slate-400'}>
          Google {isGoogleLoading ? 'cargando…' : isGoogleConnected ? 'live' : 'desconectado'}
        </span>
        {googleError && (
          <button title={googleError} className="text-rose-400 hover:text-rose-300">
            <AlertCircle size={11} />
          </button>
        )}
      </div>

      {/* Google sign in/out */}
      {!isGoogleConnected ? (
        <button
          onClick={onSignInGoogle}
          className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
        >
          <LogIn size={11} />
          <span>Conectar Google</span>
        </button>
      ) : (
        <button
          onClick={onSignOutGoogle}
          className="flex items-center gap-1 ml-auto px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all"
        >
          <LogOut size={11} />
          <span>Desconectar</span>
        </button>
      )}

      {/* Live data badge */}
      {(isMetaConnected || isGoogleConnected) && (
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Datos en vivo</span>
        </div>
      )}
    </div>
  );
};

export default ApiStatusBar;
