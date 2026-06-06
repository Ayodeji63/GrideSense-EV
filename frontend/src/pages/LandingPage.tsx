import { BiBoltCircle, BiMapAlt, BiRightArrowAlt } from 'react-icons/bi'

type LandingPageProps = {
  onContinue: () => void
}

export function LandingPage({ onContinue }: LandingPageProps) {
  return (
    <div className="page landing-page">
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      <section className="landing-hero">
        <p className="eyebrow">GRIDSENSE EV</p>
        <h1>Charging intelligence for every Lagos drive.</h1>
        <p className="landing-copy">
          Discover reliable stations, live grid health, and the fastest usable stop before you leave
          the curb.
        </p>
      </section>

      <section className="landing-panel">
        <div className="landing-stat-grid">
          <article>
            <BiMapAlt aria-hidden="true" />
            <strong>Live routes</strong>
            <span>Driver-aware station picks</span>
          </article>
          <article>
            <BiBoltCircle aria-hidden="true" />
            <strong>Grid status</strong>
            <span>Telemetry-backed availability</span>
          </article>
        </div>

        <button className="landing-button" onClick={onContinue} type="button">
          Enter driver app
          <BiRightArrowAlt aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}
