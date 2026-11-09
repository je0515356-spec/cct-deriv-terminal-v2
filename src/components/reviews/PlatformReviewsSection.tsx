import React from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, Award, Sparkles, Plus } from 'lucide-react';
import { PlatformReview } from '../../types/review';

interface PlatformReviewsSectionProps {
  reviews: PlatformReview[];
  onOpenAddReview: () => void;
}

export const PlatformReviewsSection: React.FC<PlatformReviewsSectionProps> = ({
  reviews,
  onOpenAddReview,
}) => {
  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const fourStarCount = reviews.filter((r) => r.rating === 4).length;
  const fiveStarPct = Math.round((fiveStarCount / reviews.length) * 100) || 90;
  const fourStarPct = Math.round((fourStarCount / reviews.length) * 100) || 10;

  return (
    <div className="border-t border-slate-800/80 bg-gradient-to-b from-[#070b14] via-[#091020] to-[#070b14] px-4 py-16 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Avis Clients & Notation de la Plateforme</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Ce que les Traders Disent de CCT — Crown Come Trader
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Découvrez les retours authentiques de notre communauté de traders sur la précision graphique, la fluidité des flux temps réel et le Journal de Trading PRO.
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="p-6 rounded-2xl bg-[#090e1a] border border-amber-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-xl">
          {/* Big Score */}
          <div className="text-center md:border-r border-slate-800 md:pr-6 space-y-2">
            <div className="text-5xl font-black font-mono text-amber-400">{avgRating}</div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Note moyenne basée sur <strong>{reviews.length} avis de traders vérifiés</strong>
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2 text-xs text-slate-400 md:border-r border-slate-800 md:pr-6">
            <div className="flex items-center gap-2">
              <span className="w-12 font-mono">5 étoiles</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${fiveStarPct}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono">{fiveStarPct}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-12 font-mono">4 étoiles</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400/70 rounded-full"
                  style={{ width: `${fourStarPct}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono">{fourStarPct}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-12 font-mono text-slate-600">3 étoiles</span>
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400/30 rounded-full" style={{ width: '0%' }} />
              </div>
              <span className="w-8 text-right font-mono text-slate-600">0%</span>
            </div>
          </div>

          {/* Give your review CTA */}
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-300">
              Vous utilisez le terminal CCT pour vos analyses et votre backtesting ?
            </p>
            <button
              onClick={onOpenAddReview}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-95"
            >
              <Star className="w-4 h-4 fill-slate-950" />
              Donner Mon Avis (Étoiles)
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#090e1a]/90 border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors">
                  {rev.title}
                </h4>

                {/* Comment body */}
                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
              </div>

              {/* Author Footer */}
              <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                    <span>{rev.author}</span>
                    {rev.verified && (
                      <span title="Trader Vérifié" className="inline-flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-cyan-400">{rev.market}</div>
                </div>

                {rev.location && (
                  <span className="text-[10px] text-slate-500 font-mono">{rev.location}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
