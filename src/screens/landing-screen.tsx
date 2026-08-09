import Head from "expo-router/head";

import appIcon from "../../assets/images/icon.png";
import heroScreenshot from "../../store-assets/apple/iphone/1320x2868/fr-FR/04-device-top.png";
import gameplaySetup from "../../store-assets/apple/iphone/1320x2868/fr-FR/01-hero.png";
import gameplayRole from "../../store-assets/apple/iphone/1320x2868/fr-FR/02-device-bottom.png";
import gameplayResult from "../../store-assets/apple/iphone/1320x2868/fr-FR/06-device-bottom.png";

import "./landing-screen.css";

const appStoreUrl = "https://apps.apple.com/fr/app/guessit-le-complice/id6794387024?l=en-GB";
const gameplayScreenshots = [
  {
    source: gameplaySetup,
    label: "Configurez votre partie",
  },
  {
    source: gameplayRole,
    label: "Découvrez votre rôle",
  },
  {
    source: gameplayResult,
    label: "Révélez le Complice",
  },
];

const gameFacts = ["👥 4–10 joueurs", "⏱ 3–7 min", "📱 Un seul téléphone", "🌐 Dans le navigateur"];

const steps = [
  {
    number: "1",
    title: "Passez le téléphone",
    copy: "Chacun découvre secrètement son rôle.",
  },
  {
    number: "2",
    title: "Posez vos questions",
    copy: "Trouvez le mot avec des questions fermées.",
  },
  {
    number: "3",
    title: "Brouillez les pistes",
    copy: "Le Complice connaît la réponse et reste discret.",
  },
  {
    number: "4",
    title: "Votez",
    copy: "Démasquez le Complice avant la fin du chrono.",
  },
];

const funReasons = [
  {
    title: "Zéro préparation",
    copy: "Ajoutez les prénoms et lancez la première manche.",
  },
  {
    title: "Tout le monde joue",
    copy: "Une règle simple, des rôles secrets et aucun temps mort.",
  },
  {
    title: "Jamais la même partie",
    copy: "Les questions, les bluffs et les soupçons changent à chaque mot.",
  },
];

const faqs = [
  {
    question: "Combien de personnes peuvent jouer ?",
    answer: "De 4 à 10 joueurs autour d’un seul téléphone.",
  },
  {
    question: "Peut-on jouer sans installer l’application ?",
    answer:
      "Oui. La version web reste disponible, et l’application iOS est maintenant disponible sur l’App Store.",
  },
  {
    question: "Combien de temps dure une manche ?",
    answer: "Choisissez un chrono de 3, 5 ou 7 minutes.",
  },
];

export function LandingScreen() {
  return (
    <>
      <Head>
        <title>GuessIt : Le Complice</title>
        <meta
          name="description"
          content="Découvrez GuessIt, le jeu de bluff et de déduction pour vos soirées, sur iOS, Android et web."
        />
      </Head>

      <main className="landing">
        <div className="landing__page">
          <header className="landing__brand" aria-label="GuessIt">
            <img className="landing__brand-icon" src={appIcon} alt="" />
            <span>GuessIt</span>
          </header>

          <section className="landing__hero" aria-labelledby="landing-title">
            <div className="landing__hero-copy">
              <p className="landing__eyebrow">BLUFF, DÉDUCTION & FOUS RIRES</p>
              <h1 id="landing-title">Le Complice se cache autour de la table.</h1>
              <p className="landing__subtitle">
                Un téléphone passe de main en main. Tout le monde cherche le mot secret. Une seule
                personne brouille les pistes.
              </p>
              <p className="landing__social-proof">
                Le jeu parfait pour lancer une soirée en 30 secondes.
              </p>

              <div className="landing__downloads">
                <p className="landing__downloads-label">TÉLÉCHARGER L’APPLICATION</p>
                <div className="landing__store-list">
                  <StoreDownloadCard platform="iOS" />
                  <StoreDownloadCard platform="Android" />
                </div>
              </div>

              <div className="landing__hero-action">
                <a className="landing__button landing__button--secondary" href="/play">
                  Jouer sur le web
                </a>
                <p>Disponible maintenant · sans installation</p>
              </div>

              <ul className="landing__facts">
                {gameFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>

            <div className="landing__hero-visual">
              <div className="landing__hero-accent" />
              <img src={heroScreenshot} alt="Écran de jeu montrant le chrono d’une manche" />
            </div>
          </section>

          <section className="landing__section" aria-labelledby="steps-title">
            <SectionHeader
              eyebrow="COMMENT ÇA MARCHE"
              id="steps-title"
              title="Une partie comprise en moins de 15 secondes."
            />
            <ol className="landing__grid landing__grid--four">
              {steps.map((step) => (
                <li key={step.number} className="landing__card landing__step-card">
                  <span className="landing__step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="landing__section" aria-labelledby="gameplay-title">
            <SectionHeader
              eyebrow="DANS LE JEU"
              id="gameplay-title"
              title="Voyez la partie avant de jouer."
              copy="Des rôles secrets au vote final, tout se joue sur une interface simple à faire circuler."
            />
            <div className="landing__grid landing__grid--three">
              {gameplayScreenshots.map((screenshot) => (
                <figure key={screenshot.label} className="landing__screenshot-card">
                  <img src={screenshot.source} alt={screenshot.label} />
                  <figcaption>{screenshot.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="landing__section" aria-labelledby="reasons-title">
            <SectionHeader
              eyebrow="POURQUOI ÇA MARCHE"
              id="reasons-title"
              title="Quelques règles. Beaucoup de soupçons."
            />
            <div className="landing__grid landing__grid--three">
              {funReasons.map((reason) => (
                <article key={reason.title} className="landing__card landing__fun-card">
                  <h3>{reason.title}</h3>
                  <p>{reason.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing__faq" aria-labelledby="faq-title">
            <SectionHeader eyebrow="FAQ" id="faq-title" title="Avant de passer le téléphone." />
            <div className="landing__faq-list">
              {faqs.map((faq) => (
                <article key={faq.question} className="landing__faq-card">
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing__final" aria-labelledby="final-title">
            <div>
              <p className="landing__final-eyebrow">PRÊTS À BLUFFER ?</p>
              <h2 id="final-title">Qui sera le meilleur Complice ?</h2>
              <p>Téléchargez GuessIt sur iOS ou lancez la version web maintenant.</p>
            </div>
            <div className="landing__final-action">
              <div className="landing__store-list">
                <StoreDownloadCard platform="iOS" />
                <StoreDownloadCard platform="Android" />
              </div>
              <a className="landing__button landing__button--secondary" href="/play">
                Jouer sur le web
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function SectionHeader({
  eyebrow,
  id,
  title,
  copy,
}: {
  eyebrow: string;
  id: string;
  title: string;
  copy?: string;
}) {
  return (
    <header className="landing__section-header">
      <p className="landing__eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </header>
  );
}

function StoreDownloadCard({ platform }: { platform: "iOS" | "Android" }) {
  const isAvailable = platform === "iOS";
  const storeName = platform === "iOS" ? "l’App Store" : "Google Play";
  const content = (
    <>
      <img className="landing__store-icon" src={appIcon} alt="" />
      <span className="landing__store-copy">
        <span className={`landing__store-tag landing__store-tag--${platform.toLowerCase()}`}>
          {platform}
        </span>
        <strong>Télécharger sur {storeName}</strong>
        {isAvailable ? (
          <span className="landing__store-status">Disponible maintenant</span>
        ) : (
          <span>Bientôt disponible</span>
        )}
      </span>
    </>
  );

  return isAvailable ? (
    <a className="landing__store-card" href={appStoreUrl}>
      {content}
    </a>
  ) : (
    <div className="landing__store-card landing__store-card--disabled" aria-disabled="true">
      {content}
    </div>
  );
}
