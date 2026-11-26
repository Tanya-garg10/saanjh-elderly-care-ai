import React from 'react';
import { ArrowRight, Mic, ShieldCheck, Calendar, HeartHandshake } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { ASSETS } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

export const LandingPage: React.FC = () => {
  const { navigate, loginAsDemo } = useSaanjh();

  return (
    <div className="min-h-screen bg-[var(--bg-ivory)] text-[var(--text-primary)]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-ivory)]/95 backdrop-blur-sm border-b border-[var(--border-hairline)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand wordmark only */}
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-tight text-[var(--deep-green)] whitespace-nowrap shrink-0"
          >
            Saanjh
          </a>

          {/* Zone 2: 4 concise single-line text links */}
          <nav
            aria-label="Landing sections"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--text-secondary)]"
          >
            <a
              href="#problem"
              className="hover:text-[var(--deep-green)] transition-colors whitespace-nowrap shrink-0"
            >
              Philosophy
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[var(--deep-green)] transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-[var(--deep-green)] transition-colors whitespace-nowrap shrink-0"
            >
              Features
            </a>
            <a
              href="#privacy"
              className="hover:text-[var(--deep-green)] transition-colors whitespace-nowrap shrink-0"
            >
              Privacy
            </a>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
          >
            Get Started
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-medium text-[var(--deep-green)] mb-4">
                Care without constant surveillance
              </p>
              <h1
                className="font-display font-bold tracking-tight text-[var(--text-primary)] leading-[1.12] max-w-xl"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.4rem)', textWrap: 'balance' }}
              >
                Care that stays close, even when family can&apos;t.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl">
                Saanjh is a calm, voice-first daily companion for older adults and a gentle bridge
                for the families who love them—built on dignity, consent, and everyday simplicity.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('auth')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--deep-green)] text-white text-base font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-[var(--text-primary)] text-base font-medium hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-secondary)]">
                <span>Voice &amp; text companion</span>
                <span aria-hidden="true">·</span>
                <span>Granular consent controls</span>
                <span aria-hidden="true">·</span>
                <span>Offline-ready demo</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[320px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--surface-white)]">
                <SafeImage
                  src={ASSETS.heroLiving}
                  alt="Meera enjoying calm morning sunlight in her living room with indoor plants"
                  className="w-full h-full object-cover"
                  fallbackLabel="Saanjh · Calm independent living"
                />
              </div>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section
          id="problem"
          className="border-t border-[var(--border-hairline)] bg-[var(--surface-white)] py-16 lg:py-24"
        >
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm font-medium text-[var(--accent-terracotta)]">The Problem</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Most care tools treat elders like patients under watch.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-base leading-relaxed text-[var(--text-secondary)]">
              <p>
                Families living in different cities often worry quietly about daily medicines,
                upcoming clinic visits, and whether their parents feel rested or lonely. Yet
                conventional monitoring apps rely on cameras, constant alerts, and complex clinical
                charts that erode independence.
              </p>
              <p>
                Older adults do not want to be managed—they want clear, unhurried support for their
                own routines, and the freedom to decide what their children can see.
              </p>
            </div>
          </div>
        </section>

        {/* How Saanjh Helps */}
        <section id="how-it-works" className="py-16 lg:py-24 border-t border-[var(--border-hairline)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--deep-green)]">How Saanjh Helps</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Three calm habits that keep everyone reassured.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-7 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
                <p className="font-mono-tabular text-sm text-[var(--primary-sage)]">01.</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Speak or tap at your own pace
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                  Ask Saanjh about today&apos;s medicines or next clinic visit in English, Hindi, or
                  Hinglish—using voice or comfortable text.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
                <p className="font-mono-tabular text-sm text-[var(--primary-sage)]">02.</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Confirm routines without friction
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                  Mark medicines taken with one tap, record how you feel in seconds, and keep
                  doctor notes organized in one warm view.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
                <p className="font-mono-tabular text-sm text-[var(--primary-sage)]">03.</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Share only what you approve
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                  Toggle family visibility by category. Pause wellbeing notes or medicine logs
                  anytime—and family views respect your boundary immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features (Asymmetric Editorial Grid) */}
        <section
          id="features"
          className="py-16 lg:py-24 border-t border-[var(--border-hairline)] bg-[var(--surface-white)]"
        >
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[var(--deep-green)]">Core Capabilities</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Purpose-built around everyday life, not clinical clutter.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-8 rounded-2xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)] flex flex-col justify-between">
                <div>
                  <Mic className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-[var(--text-primary)]">
                    Voice-First Companion in English, Hindi &amp; Hinglish
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                    Designed for natural questions like &ldquo;What medicines do I need to take
                    today?&rdquo; or &ldquo;Mera next doctor appointment kab hai?&rdquo; with
                    optional read-aloud responses and an accessible text fallback whenever browser
                    speech recognition is unavailable.
                  </p>
                </div>
                <p className="mt-6 text-sm text-[var(--text-secondary)]">
                  Grounded strictly in your saved schedule · No invented answers
                </p>
              </div>

              <div className="lg:col-span-5 p-8 rounded-2xl bg-[var(--secondary-sage)] border border-[var(--border-hairline)] flex flex-col justify-between">
                <div>
                  <ShieldCheck className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
                  <h3 className="mt-5 font-display text-2xl font-semibold text-[var(--deep-green)]">
                    Consent-First Family View
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--text-primary)]">
                    Every category—medicines, appointments, wellbeing check-ins, insights, and
                    activity—has an independent switch. When paused, family dashboards display a
                    respectful privacy notice instead of data.
                  </p>
                </div>
                <p className="mt-6 text-sm text-[var(--deep-green)]">
                  Reversible anytime · Zero hidden tracking
                </p>
              </div>

              <div className="lg:col-span-5 p-8 rounded-2xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)]">
                <Calendar className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Honest Medicine &amp; Appointment Tracking
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                  Clearly distinguishes self-confirmed reminders from automated verification, and
                  organizes upcoming clinic visits with plain-language doctor notes.
                </p>
              </div>

              <div className="lg:col-span-7 p-8 rounded-2xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)]">
                <HeartHandshake className="w-6 h-6 text-[var(--accent-terracotta)]" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl font-semibold text-[var(--text-primary)]">
                  Neutral Routine Insights &amp; One-Tap Help
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                  Explains why a pattern appears using calm, non-diagnostic phrasing alongside a
                  prominent, non-alarming support button whenever you want to reach out.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy First Approach */}
        <section id="privacy" className="py-16 lg:py-24 border-t border-[var(--border-hairline)]">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--surface-white)]">
                <SafeImage
                  src={ASSETS.familyConnection}
                  alt="Meera and her daughter Ananya sharing morning tea and conversation at a sunlit kitchen table"
                  className="w-full h-auto object-cover"
                  fallbackLabel="Meera & Ananya · Connected with respect"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <p className="text-sm font-medium text-[var(--deep-green)]">Privacy First Approach</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                Trust is built when the elder holds the keys.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                Meera decides what Ananya sees. Whether sharing every morning medicine confirmation
                or keeping personal mood reflections private for a few days, Saanjh enforces consent
                explicitly across the experience.
              </p>

              <div className="mt-8 space-y-4 border-t border-[var(--border-hairline)] pt-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    Explicit category permissions
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Separate controls for Medicines, Appointments, Wellbeing, Insights, and Activity.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    Clear local-first transparency
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    In this offline MVP, all data stays in your browser&apos;s local storage with
                    zero background cloud surveillance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Designed for Seniors */}
        <section className="py-16 lg:py-20 border-t border-[var(--border-hairline)] bg-[var(--surface-white)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <p className="text-sm font-medium text-[var(--deep-green)]">Designed for Seniors</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Built-in comfort from the first tap.
                </h2>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Adjustable Text &amp; Contrast</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    One-tap Larger Text and High Contrast modes raise readability across every screen.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Simplified Navigation</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Optionally hide secondary tabs so only essential daily tasks remain visible.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Larger Touch Targets</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Generous buttons, clear focus rings, and calm spacing prevent accidental taps.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Reduced Motion Option</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    Respects system motion settings and offers an instant in-app calm mode toggle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 border-t border-[var(--border-hairline)]">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
              Experience Meera &amp; Ananya&apos;s interactive care demo.
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Try confirming a morning medicine, asking Saanjh in Hindi or English, pausing a
              privacy permission, and verifying the change in Ananya&apos;s family view.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => loginAsDemo('senior')}
                className="px-6 py-3.5 rounded-xl bg-[var(--deep-green)] text-white text-base font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
              >
                Open Meera&apos;s Senior Dashboard
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('family')}
                className="px-6 py-3.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-[var(--text-primary)] text-base font-medium hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap shrink-0"
              >
                Open Ananya&apos;s Family View
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-hairline)] bg-[var(--surface-white)] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
          <span className="font-display font-semibold text-[var(--deep-green)]">Saanjh</span>
          <span>Offline-first interactive prototype · Fictional demo profiles (Meera &amp; Ananya Sharma)</span>
        </div>
      </footer>
    </div>
  );
};
