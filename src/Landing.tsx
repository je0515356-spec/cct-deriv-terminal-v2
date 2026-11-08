
import {
  ArrowRight,
  ChartCandlestick,
  ChartNoAxesCombined,
  MoveUpRight,
  ShieldCheck,
  Layers3,
  Camera,
  Bookmark,
  MousePointer2,
  MessageCircle,
  Facebook,
  CheckCircle2,
  BookOpen,
  LockKeyhole,
  ExternalLink
} from 'lucide-react';

import './landing.css';

const FACEBOOK = 'https://www.facebook.com/loza.nama.376/';
const WHATSAPP = 'https://wa.me/261382817100';

const features = [
  {
    icon: ChartCandlestick,
    title: 'Graphiques Deriv',
    desc: 'Cours et chandeliers des marchés disponibles via le flux public Deriv.'
  },
  {
    icon: Layers3,
    title: 'Analyse graphique',
    desc: 'Lignes, rectangles, Fibonacci et annotations directement sur les graphiques.'
  },
  {
    icon: MoveUpRight,
    title: 'Positions Long / Short',
    desc: 'Simulez vos scénarios, vos niveaux de risque et vos objectifs R/R.'
  },
  {
    icon: Camera,
    title: 'Capture du graphique',
    desc: 'Exportez vos analyses et vos dessins au format PNG.'
  },
  {
    icon: Bookmark,
    title: 'Marchés favoris',
    desc: 'Retrouvez plus facilement les instruments que vous consultez.'
  },
  {
    icon: MousePointer2,
    title: 'Replay historique gratuit',
    desc: 'Sélectionnez, déplacez et ajustez vos tracés sur le graphique.'
  }
];

const rules = [
  [
    '01',
    'Préparez votre scénario',
    'Analysez le contexte et les niveaux clés avant toute décision.'
  ],
  [
    '02',
    'Définissez le risque',
    'Identifiez le stop-loss, l’invalidation et la taille de position.'
  ],
  [
    '03',
    'Respectez votre plan',
    'Évitez de déplacer vos objectifs sous l’effet des émotions.'
  ],
  [
    '04',
    'Évitez le surtrading',
    'Ne multipliez pas les positions pour compenser une perte.'
  ],
  [
    '05',
    'Évaluez le R/R',
    'Comparez le gain potentiel au risque, sans garantie de résultat.'
  ],
  [
    '06',
    'Tenez un journal',
    'Conservez vos captures et notes pour améliorer votre méthode.'
  ]
];

type LandingProps = {
  onEnter: () => void;
};

export default function Landing({ onEnter }: LandingProps) {
  return (
    <div className="cct-home" id="accueil">
      <header className="cct-home-nav">
        <a
          href="#accueil"
          className="cct-home-brand"
          aria-label="CCT Terminal, accueil"
        >
          <span className="cct-home-mark">
            <ChartNoAxesCombined size={26} />
          </span>

          <span>
            <strong>
              CCT <b>TERMINAL</b>
            </strong>
            <small>ANALYSE DES MARCHÉS DERIV</small>
          </span>
        </a>

        <nav aria-label="Navigation principale">
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#regles">Règles de trading</a>
          <a href="#brokers">Brokers</a><a href="#contact">Contact</a>
          <a href="https://www.weltrade.com/tools/charts/" target="_blank" rel="noopener noreferrer">Weltrade <ExternalLink size={13} /></a>
        </nav>

        <button
          className="cct-home-nav-btn"
          onClick={onEnter}
        >
          Ouvrir le terminal
          <ArrowRight size={16} />
        </button>
      </header>

      <main>
        <section className="cct-home-hero">
          <div className="cct-home-glow" />

          <div className="cct-home-hero-copy">
            <div className="cct-home-kicker">
              <span className="cct-home-pulse" />
              PLATEFORME D'ANALYSE · VERSION ALPHA
            </div>

            <h1>
              Vos graphiques.
              <br />
              <span>Votre analyse.</span>
              <br />
              Votre discipline.
            </h1>

            <p>
              Un espace indépendant pour explorer les marchés
              Deriv, tracer vos niveaux et préparer vos
              scénarios de trading. Simple, visuel et centré
              sur l'analyse.
            </p>

            <div className="cct-home-hero-actions">
              <button
                onClick={onEnter}
                className="cct-home-primary"
              >
                Accéder aux graphiques
                <ArrowRight size={18} />
              </button>

              <a
                href="#fonctionnalites"
                className="cct-home-outline"
              >
                Découvrir les outils
              </a>
            </div>

            <div className="cct-home-trust">
              <span>
                <CheckCircle2 size={15} />
                Données Deriv réelles
              </span>

              <span>
                <CheckCircle2 size={15} />
                Replay historique gratuit
              </span>

              <span>
                <LockKeyhole size={15} />
                Aucun ordre réel
              </span>
            </div>
          </div>

          <div
            className="cct-home-preview"
            aria-label="Illustration stylisée d'un graphique, non issue de données de marché"
          >
            <div className="cct-home-preview-bar">
              <span className="cct-home-dots">● ● ●</span>
              <span>CCT · ANALYSE GRAPHIQUE</span>
              <span>ILLUSTRATION</span>
            </div>

            <svg
              viewBox="0 0 520 310"
              role="img"
              aria-label="Illustration décorative de chandeliers, pas de données réelles"
            >
              <defs>
                <linearGradient
                  id="heroFade"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    stopColor="#25d6c0"
                    stopOpacity=".18"
                  />
                  <stop
                    offset="1"
                    stopColor="#25d6c0"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {Array.from({ length: 7 }, (_, i) => (
                <line
                  key={'h' + i}
                  x1="0"
                  y1={35 + i * 40}
                  x2="520"
                  y2={35 + i * 40}
                  stroke="#274260"
                  strokeOpacity=".55"
                />
              ))}

              {Array.from({ length: 9 }, (_, i) => (
                <line
                  key={'v' + i}
                  x1={30 + i * 60}
                  y1="0"
                  x2={30 + i * 60}
                  y2="310"
                  stroke="#274260"
                  strokeOpacity=".4"
                />
              ))}

              <path
                d="M18 220 L56 196 L94 206 L132 160 L170 180 L208 145 L246 166 L284 126 L322 140 L360 95 L398 113 L436 75 L484 65"
                stroke="#24d4bf"
                strokeWidth="2"
                fill="none"
                opacity=".65"
              />

              <path
                d="M18 220 L56 196 L94 206 L132 160 L170 180 L208 145 L246 166 L284 126 L322 140 L360 95 L398 113 L436 75 L484 65 L484 310 L18 310Z"
                fill="url(#heroFade)"
              />

              {Array.from({ length: 18 }, (_, i) => {
                const center =
                  230 - i * 8 + Math.sin(i * 1.8) * 23;

                const rise = i % 4 !== 0;

                return (
                  <g key={i}>
                    <line
                      x1={28 + i * 26}
                      y1={center - 18}
                      x2={28 + i * 26}
                      y2={center + 27}
                      stroke={rise ? '#27d5b6' : '#fa6b86'}
                      strokeWidth="2"
                    />

                    <rect
                      x={22 + i * 26}
                      y={rise ? center - 7 : center - 1}
                      width="12"
                      height={rise ? 21 : 20}
                      rx="1"
                      fill={rise ? '#27d5b6' : '#fa6b86'}
                    />
                  </g>
                );
              })}

              <rect
                x="292"
                y="45"
                width="185"
                height="88"
                rx="4"
                fill="#2ad3b4"
                fillOpacity=".13"
                stroke="#2ad3b4"
                strokeDasharray="5 4"
              />

              <rect
                x="292"
                y="133"
                width="185"
                height="55"
                rx="4"
                fill="#fa6b86"
                fillOpacity=".13"
                stroke="#fa6b86"
                strokeDasharray="5 4"
              />

              <text
                x="305"
                y="62"
                fill="#5cf3d3"
                fontSize="11"
              >
                ZONE OBJECTIF · TP
              </text>

              <text
                x="305"
                y="155"
                fill="#ff9eb0"
                fontSize="11"
              >
                ZONE RISQUE · SL
              </text>
            </svg>

            <div className="cct-home-preview-footer">
              <span>
                <i />
                Illustration des outils d'analyse
              </span>
              <span>LONG / SHORT · ZONES</span>
            </div>
          </div>
        </section>

        <section
          id="fonctionnalites"
          className="cct-home-section"
        >
          <div className="cct-home-section-head">
            <span>LES OUTILS</span>
            <h2>Tout l'essentiel pour analyser</h2>
            <p>
              Les fonctions de notre terminal, réunies dans
              une interface pensée pour la lecture des graphiques.
            </p>
          </div>

          <div className="cct-home-feature-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="cct-home-feature"
              >
                <span className="cct-home-feature-icon">
                  <Icon size={22} />
                </span>

                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="regles"
          className="cct-home-rules"
        >
          <div className="cct-home-section-head">
            <span>
              <ShieldCheck size={15} />
              CCT TRADING RULES
            </span>

            <h2>La discipline avant le profit</h2>

            <p>
              Six principes éducatifs pour structurer vos
              analyses et gérer les risques.
            </p>
          </div>

          <div className="cct-home-rules-grid">
            {rules.map(([n, title, desc]) => (
              <article key={n}>
                <strong>{n}</strong>

                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="cct-home-risk">
            <BookOpen size={20} />

            <p>
              <strong>Avertissement :</strong> les produits
              financiers et indices synthétiques comportent
              des risques de perte. Les informations présentées
              sont éducatives et ne constituent pas des conseils
              financiers. CCT TERMINAL ne garantit aucun gain
              et ne permet pas de passer des ordres réels.
            </p>
          </div>
        </section>

        <section id="brokers" className="cct-home-section cct-brokers-section">
          <div className="cct-home-section-head">
            <span>ACCÈS BROKERS · PARTENAIRES</span>
            <h2>Choisissez votre plateforme</h2>
            <p>Retrouvez les accès officiels à Deriv et Weltrade. Vous pouvez ouvrir un compte auprès du broker de votre choix, indépendamment de votre compte CCT.</p>
          </div>
          <div className="cct-broker-grid">
            <a className="cct-broker-card cct-broker-weltrade" href="https://track.gowt.me/visit/?bta=68638&brand=weltrade" target="_blank" rel="noopener noreferrer">
              <span className="cct-broker-brand"><b className="cct-broker-logo weltrade-logo">W</b><strong>WELTRADE</strong></span>
              <span className="cct-broker-copy"><strong>Découvrir Weltrade</strong><small>Accéder au site du broker et créer un compte</small></span>
              <ExternalLink size={19}/>
            </a>
            <a className="cct-broker-card cct-broker-deriv" href="https://t.deriv.link?t=8HPVH5MBBBBK" target="_blank" rel="noopener noreferrer">
              <span className="cct-broker-brand"><b className="cct-broker-logo deriv-logo">D</b><strong>Deriv</strong></span>
              <span className="cct-broker-copy"><strong>Découvrir Deriv</strong><small>Accéder au site du broker et créer un compte</small></span>
              <ExternalLink size={19}/>
            </a>
          </div>
          <p className="cct-broker-disclosure"><ShieldCheck size={14}/> Transparence : ces boutons utilisent nos liens de parrainage. CCT peut recevoir une commission si vous ouvrez un compte via ces liens. Cela ne garantit aucun avantage ni résultat de trading. Vérifiez les conditions et la disponibilité des services dans votre pays.</p>
        </section>

        <section className="cct-home-section cct-weltrade-section">
          <div className="cct-home-section-head">
            <span>ACCÈS GRAPHIQUES EXTERNES</span>
            <h2>Weltrade TradingView</h2>
            <p>Ouvrez les graphiques TradingView proposés par Weltrade dans un nouvel onglet. Votre connexion et vos modèles synchronisés restent gérés directement par Weltrade.</p>
          </div>
          <a className="cct-weltrade-card" href="https://www.weltrade.com/tools/charts/" target="_blank" rel="noopener noreferrer">
            <span className="cct-weltrade-card-icon"><ChartCandlestick size={25} /></span>
            <span><strong>Ouvrir les graphiques Weltrade</strong><small>Site officiel · Nouvel onglet · Connexion Weltrade requise selon les fonctions</small></span>
            <ExternalLink size={19} />
          </a>
        </section>

        <section
          id="contact"
          className="cct-home-contact"
        >
          <div>
            <span>CONTACT & ASSISTANCE</span>

            <h2>Une question sur le terminal ?</h2>

            <p>
              Contactez l'administrateur pour une question
              sur l'utilisation de la plateforme ou les
              outils d'analyse.
            </p>
          </div>

          <div className="cct-home-contact-actions">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="cct-home-wa"
            >
              <MessageCircle size={19} />
              WhatsApp · +261 38 28 171 00
              <ArrowRight size={17} />
            </a>

            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="cct-home-fb"
            >
              <Facebook size={19} />
              Contacter sur Facebook
              <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>

      <footer className="cct-home-footer">
        <span>
          © {new Date().getFullYear()} CCT TERMINAL ·
          Plateforme indépendante d'analyse
        </span>

        <span>
          Version alpha · Données publiques Deriv ·
          Aucun trading réel
        </span>
      </footer>
    </div>
  );
}
