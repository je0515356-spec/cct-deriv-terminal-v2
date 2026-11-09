import React, { useState } from 'react';
import {
  X,
  Download,
  Check,
  UploadCloud,
  GitBranch,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  FileCode,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'github'>('direct');
  const [isDownloadingDeploy, setIsDownloadingDeploy] = useState(false);
  const [isDownloadingSource, setIsDownloadingSource] = useState(false);
  const [downloadDeployInfo, setDownloadDeployInfo] = useState<{ sizeKb: number; count: number } | null>(null);
  const [downloadSourceInfo, setDownloadSourceInfo] = useState<{ sizeKb: number } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Safe In-Memory Blob Download (Guarantees no 0-byte iframe download failure)
  const handleDownloadDeployZip = async () => {
    setIsDownloadingDeploy(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/cct-cloudflare-pages-deploy.zip?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Erreur réseau (${response.status}) lors du téléchargement.`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Le fichier téléchargé est vide. Veuillez réessayer.');
      }

      // Trigger reliable browser download via in-memory Blob URL
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'cct-cloudflare-pages-deploy.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      const sizeKb = Math.round(blob.size / 1024);
      setDownloadDeployInfo({ sizeKb, count: 6 });
      setIsDownloadingDeploy(false);
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloadError(err?.message || 'Erreur lors du téléchargement du fichier.');
      setIsDownloadingDeploy(false);
    }
  };

  const handleDownloadSourceZip = async () => {
    setIsDownloadingSource(true);
    setDownloadError(null);

    try {
      const response = await fetch(`/cct-source-code.zip?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Erreur réseau (${response.status})`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Fichier source vide.');
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'cct-source-code.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      const sizeKb = Math.round(blob.size / 1024);
      setDownloadSourceInfo({ sizeKb });
      setIsDownloadingSource(false);
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloadError(err?.message || 'Erreur lors du téléchargement.');
      setIsDownloadingSource(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[92vh] bg-[#090e1a] border border-cyan-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#070b14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-100">Exporter & Déployer sur Cloudflare Pages</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Gratuit
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Mettez votre terminal CCT en ligne sur votre propre adresse web mondiale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Méthode 1 : Direct Upload (Sans GitHub - 1 Minute)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'github'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <GitBranch className="w-4 h-4 text-purple-400" />
            Méthode 2 : Déploiement Git (GitHub)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {downloadError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{downloadError}</span>
            </div>
          )}

          {activeTab === 'direct' ? (
            <div className="space-y-5">
              {/* Highlight Banner */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-2 text-sm text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Téléchargement direct en mémoire (Garanti non vide)
                </div>
                <p className="text-xs text-emerald-300/90 leading-relaxed">
                  L'archive contient <strong>l'intégralité du site compilé (1,87 Mo décompressé)</strong> avec <code>index.html</code>, les scripts et styles <code>assets/</code>, ainsi que le fichier de routage <code>_redirects</code>.
                </p>
              </div>

              {/* Step by step guide */}
              <div className="space-y-3">
                <div className="font-bold text-sm text-slate-100">
                  3 étapes pour mettre votre site en ligne :
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Step 1 */}
                  <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-slate-200">
                        Télécharger le Pack Cloudflare (.ZIP de ~386 Ko)
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Cliquez sur le bouton vert ci-dessous. Le navigateur télécharge directement en mémoire le fichier <code>cct-cloudflare-pages-deploy.zip</code>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-slate-200">
                        Décompresser l'archive sur votre ordinateur
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Faites un clic droit sur le fichier téléchargé &gt; <strong>« Extraire tout... »</strong> (ou double-clic sur Mac).
                        Vous trouverez à l'intérieur le fichier <code>index.html</code>, le dossier <code>assets</code> avec tous les fichiers de l'application, et les instructions <code>LISEZ_MOI_CLOUDFLARE.txt</code>.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-slate-200">
                        Glisser-déposer sur Cloudflare Pages
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Ouvrez{' '}
                        <a
                          href="https://dash.cloudflare.com"
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          dash.cloudflare.com <ExternalLink className="w-3 h-3" />
                        </a>{' '}
                        &gt; <strong>Workers et Pages</strong> &gt; <strong>Créer une application</strong> &gt; Onglet <strong>Pages</strong> &gt; <strong>Télécharger des éléments (Direct Upload)</strong>.
                      </p>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Donnez un nom à votre projet (ex: <code>cct-terminal</code>) et glissez-déposez le dossier extrait. Cliquez sur <strong>« Déployer le site »</strong> !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {downloadDeployInfo && (
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Fichier téléchargé avec succès : {downloadDeployInfo.sizeKb} Ko</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    L'archive est complète (1,87 Mo de code une fois extraite). Vous pouvez maintenant faire clic droit &gt; « Extraire tout » pour voir tous les fichiers et les glisser sur Cloudflare.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl text-purple-200">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Déploiement Automatique via GitHub
                </div>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  Pour les développeurs qui souhaitent gérer le code source TypeScript / React avec Git.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-bold text-sm text-slate-100">Instructions Git :</div>
                <ol className="space-y-2.5 text-slate-300 list-decimal list-inside bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                  <li>
                    Téléchargez le pack de code source ci-dessous et décompressez-le.
                  </li>
                  <li>
                    Créez un nouveau dépôt sur{' '}
                    <a
                      href="https://github.com/new"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      github.com/new <ExternalLink className="w-3 h-3" />
                    </a>
                    .
                  </li>
                  <li>
                    Poussez les fichiers sur GitHub :
                    <pre className="mt-2 p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-cyan-300 border border-slate-800 leading-relaxed">
                      git init{"\n"}
                      git add .{"\n"}
                      git commit -m "CCT V9.0 Final"{"\n"}
                      git branch -M main{"\n"}
                      git remote add origin https://github.com/VOTRE_NOM/cct-trading.git{"\n"}
                      git push -u origin main
                    </pre>
                  </li>
                  <li>
                    Sur Cloudflare Pages : <strong>Connecter à Git</strong> &gt; sélectionnez votre dépôt.
                  </li>
                  <li>
                    Paramètres de build : Commande <code>npm run build</code> | Dossier de sortie <code>dist</code>.
                  </li>
                </ol>
              </div>

              {downloadSourceInfo && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/40 rounded-xl text-purple-300 flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span className="font-semibold">
                    Code source complet téléchargé ({downloadSourceInfo.sizeKb} Ko).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 hover:underline font-semibold"
          >
            Ouvrir Cloudflare Dashboard <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeTab === 'direct' ? (
              <button
                onClick={handleDownloadDeployZip}
                disabled={isDownloadingDeploy}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingDeploy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 stroke-[2.5]" />
                )}
                {isDownloadingDeploy ? 'Téléchargement en cours...' : 'Télécharger le Pack Cloudflare (386 Ko)'}
              </button>
            ) : (
              <button
                onClick={handleDownloadSourceZip}
                disabled={isDownloadingSource}
                className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isDownloadingSource ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileCode className="w-4 h-4" />
                )}
                {isDownloadingSource ? 'Téléchargement...' : 'Télécharger le Code Source (67 Ko)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
