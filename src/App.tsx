/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabase } from './services/supabaseClient';
import { Navbar, ActiveTab } from './components/common/Navbar';
import { HomeView } from './components/home/HomeView';
import { TradingChart } from './components/terminal/TradingChart';
import { JournalView } from './components/journal/JournalView';
import { AuthModal } from './components/auth/AuthModal';
import { GoogleAuthGate } from './components/auth/GoogleAuthGate';
import { PositionDrawing } from './types/drawing';
import { JournalTrade } from './types/journal';
import { ContactProModal } from './components/common/ContactProModal';
import { PlatformReview } from './types/review';
import { DEFAULT_PLATFORM_REVIEWS } from './data/defaultReviews';
import { PlatformReviewsModal } from './components/reviews/PlatformReviewsModal';
import { PWAInstallModal } from './components/pwa/PWAInstallModal';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  // Reviews state with persistence
  const [reviews, setReviews] = useState<PlatformReview[]>(() => {
    const saved = localStorage.getItem('cct_platform_reviews');
    return saved ? JSON.parse(saved) : DEFAULT_PLATFORM_REVIEWS;
  });

  const handleAddReview = (newRev: PlatformReview) => {
    setReviews((prev) => {
      const updated = [newRev, ...prev];
      localStorage.setItem('cct_platform_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactProModalOpen, setIsContactProModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // PWA install state
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Bridge between Chart Long/Short position tool and Journal PRO
  const [prefilledTrade, setPrefilledTrade] = useState<Partial<JournalTrade> | null>(null);

  // Listen to Supabase session state
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsGuestMode(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setIsGuestMode(false);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // When user clicks "Journaliser ce Trade" from the chart drawing
  const handleLogPositionInJournal = (pos: PositionDrawing) => {
    const isLong = pos.type === 'long_position';
    const riskDiff = Math.abs(pos.entry.price - pos.stopLossPrice);
    const targetDiff = Math.abs(pos.takeProfitPrice - pos.entry.price);
    const calculatedR = riskDiff > 0 ? Number((targetDiff / riskDiff).toFixed(2)) : 1;
    const defaultRiskAmount = 100;
    const calculatedPnl = Number((calculatedR * defaultRiskAmount).toFixed(2));

    const marketCat = pos.symbol.includes('XAU') || pos.symbol.includes('XAG')
      ? 'metals'
      : pos.symbol.startsWith('frx') || pos.symbol.includes('EUR') || pos.symbol.includes('USD')
      ? 'forex'
      : 'deriv';

    const tradeData: Partial<JournalTrade> = {
      date: new Date().toISOString().slice(0, 16),
      market: marketCat,
      symbol: pos.symbol,
      direction: isLong ? 'BUY' : 'SELL',
      entryPrice: pos.entry.price,
      stopLossPrice: pos.stopLossPrice,
      takeProfitPrice: pos.takeProfitPrice,
      exitPrice: pos.takeProfitPrice,
      volume: 1,
      riskAmount: defaultRiskAmount,
      pnl: calculatedPnl,
      pnlR: calculatedR,
      strategy: 'Setup Technique CCT Terminal',
      status: 'WIN',
      notes: `Trade importé directement depuis l'outil ${isLong ? 'Long Position' : 'Short Position'} du terminal. Ratio R:R ciblé : 1:${calculatedR}.`,
    };

    setPrefilledTrade(tradeData);
    setActiveTab('journal');
  };

  const hasAccess = Boolean(currentUser || isGuestMode);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070b14] text-slate-100 overflow-hidden font-sans">
      {/* Top Commercial Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenContactProModal={() => setIsContactProModalOpen(true)}
        onOpenReviewsModal={() => setIsReviewsModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full h-full overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeView
            onNavigateTerminal={() => setActiveTab('terminal')}
            onNavigateJournal={() => setActiveTab('journal')}
            onOpenContactPro={() => setIsContactProModalOpen(true)}
            reviews={reviews}
            onOpenAddReview={() => setIsReviewsModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {activeTab === 'terminal' && (
          hasAccess ? (
            <TradingChart onLogPositionInJournal={handleLogPositionInJournal} />
          ) : (
            <GoogleAuthGate
              onGuestAccess={() => setIsGuestMode(true)}
              onNavigateHome={() => setActiveTab('home')}
              onOpenContactPro={() => setIsContactProModalOpen(true)}
              targetFeature="terminal"
            />
          )
        )}

        {activeTab === 'journal' && (
          hasAccess ? (
            <JournalView initialNewTrade={prefilledTrade} />
          ) : (
            <GoogleAuthGate
              onGuestAccess={() => setIsGuestMode(true)}
              onNavigateHome={() => setActiveTab('home')}
              onOpenContactPro={() => setIsContactProModalOpen(true)}
              targetFeature="journal"
            />
          )
        )}
      </main>

      {/* Auth & Google Member Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* Contact Eric Rak Modal */}
      <ContactProModal
        isOpen={isContactProModalOpen}
        onClose={() => setIsContactProModalOpen(false)}
      />

      {/* Platform Star Reviews Modal */}
      <PlatformReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        onAddReview={handleAddReview}
      />

      {/* PWA Browser Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={install}
        isIOS={isIOS}
        isInstallable={isInstallable}
      />

      {/* Floating PWA Install Banner */}
      <PWAInstallBanner />
    </div>
  );
}
