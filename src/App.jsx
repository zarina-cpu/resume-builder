import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeProvider'
import { AppHeader } from './components/layout/AppHeader'
import { ServerSetupBanner } from './components/layout/ServerSetupBanner'
import { EditorPage } from './pages/EditorPage'
import { PortfolioPage } from './pages/PortfolioPage'

function AppShell({ children, showHeader = true }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <ServerSetupBanner />
      {showHeader && <AppHeader />}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AppShell>
                <EditorPage />
              </AppShell>
            }
          />
          <Route
            path="/portfolio"
            element={
              <AppShell showHeader={false}>
                <PortfolioPage />
              </AppShell>
            }
          />
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  )
}
