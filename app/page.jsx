import Game from '../src/components/Game'
import ErrorBoundary from '../src/components/ui/ErrorBoundary'

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  )
}
