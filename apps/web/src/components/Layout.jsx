import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>AI-Integrated HR & Recruitment Control Center</h1>
          <p>
            Quản trị nhân sự, tuyển dụng và insight AI trong một màn hình tổng hợp duy nhất.
          </p>
        </div>
        <div className="header-meta">
          <span className="badge">Realtime AI</span>
          <span className="badge">Skill Graph</span>
          <span className="badge accent">Talent Pulse</span>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout
