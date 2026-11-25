import { MotionConfig } from 'framer-motion'
import { CropGrid } from './components/CropGrid'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { ImpactStats } from './components/ImpactStats'
import { LiveDashboard } from './components/LiveDashboard'
import { Navbar } from './components/Navbar'
import { Partners } from './components/Partners'
import { PowerSimulator } from './components/PowerSimulator'
import { Problem } from './components/Problem'
import { Prototype } from './components/Prototype'
import { Roadmap } from './components/Roadmap'
import { Solution } from './components/Solution'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main id="main">
        <Hero />
        <Problem />
        <Solution />
        <Prototype />
        <PowerSimulator />
        <LiveDashboard />
        <CropGrid />
        <ImpactStats />
        <Roadmap />
        <Partners />
      </main>
      <Footer />
    </MotionConfig>
  )
}
