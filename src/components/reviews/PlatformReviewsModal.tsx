import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
  Send,
} from 'lucide-react';
import { PlatformReview } from '../../types/review';

interface PlatformReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: PlatformReview) => void;
}

export const PlatformReviewsModal: React.FC<PlatformReviewsModalProps> = ({
  isOpen,
  onClose,
  onAddReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [market, setMarket] = useState('Deriv Indices Synthétiques');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: PlatformReview = {
      id: 'rev_' + Date.now(),
      author: author.trim(),
      location: location.trim() || 'Trader Communauté CCT',
      market,
      rating,
      title: title.trim() || 'Avis sur CCT Crown Come Trader',
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
      verified: true,
    };

    onAddReview(newRev);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#090e1a] border border-amber-500/40 rounded-2xl shadow-2xl z-50 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Star className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Donner un Avis & Notation Étoiles</h3>
              <p className="text-[11px] text-amber-400">Votre retour d'expérience sur CCT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Merci pour votre avis !</h4>
            <p className="text-xs text-slate-300">
              Votre note de {rating} étoiles et votre témoignage ont été enregistrés avec succès.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
            {/* Interactive Stars Selection */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-xs text-slate-300 font-semibold">
                Attribuez une note globale à CCT :
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isActive
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                {rating === 5
                  ? '⭐⭐⭐⭐⭐ Excellent (5/5) — Terminal ultra précis !'
                  : rating === 4
                  ? '⭐⭐⭐⭐ Très bon (4/5)'
                  : rating === 3
                  ? '⭐⭐⭐ Moyen (3/5)'
                  : '⭐ À améliorer'}
              </span>
            </div>

            {/* Author Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Votre Nom ou Pseudo Trader *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tahina R. / Eric M."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Ville / Pays (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Antananarivo / France"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Favorite Market */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Marché principal que vous tradez
              </label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Deriv Indices Synthétiques">Deriv Indices Synthétiques (Volatility 100, Crash/Boom)</option>
                <option value="Forex Devises">Forex Devises (EUR/USD, GBP/USD)</option>
                <option value="Métaux Précieux & Or">Métaux Précieux & Or (XAU/USD)</option>
                <option value="Backtesting Replay">Backtesting Replay & SMC</option>
              </select>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Titre de votre avis
              </label>
              <input
                type="text"
                placeholder="Ex: Graphiques ultra fluides et tracés Fibonacci impeccables"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Votre commentaire & expérience *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Partagez votre ressenti sur la rapidité du flux, le journal de trading, les outils de Fibonacci ou l'accompagnement d'Eric Rak..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                Publier Mon Avis & Étoiles
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
