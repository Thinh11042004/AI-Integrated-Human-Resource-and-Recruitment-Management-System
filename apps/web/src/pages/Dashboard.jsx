import React from 'react'
import { useEmployees, useCandidates, useJobs, useAnalytics, useWorkforceInsight } from '../hooks/useApi'

const Dashboard = () => {
  const { employees, loading: employeesLoading } = useEmployees()
  const { candidates, loading: candidatesLoading } = useCandidates()
  const { jobs, loading: jobsLoading } = useJobs()
  const { analytics, loading: analyticsLoading } = useAnalytics()
  const { insight, loading: insightLoading } = useWorkforceInsight()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value, options = {}) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'percent',
      maximumFractionDigits: options.maximumFractionDigits ?? 0
    }).format(value)
  }

  if (analyticsLoading || insightLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>
  }

  const candidateByStage = Object.entries(analytics?.candidatePipeline || {})
  const openJobs = jobs?.filter(job => job.status === 'Open') || []

  return (
    <main className="dashboard-grid">
      <section className="summary-cards">
        <div className="summary-card">
          <h3>Tổng nhân sự</h3>
          <div className="summary-value">{analytics?.headcount || 0}</div>
          <div className="summary-trend">
            <span className="positive">+12% YoY</span>
            <span className="muted">{analytics?.activeContractors || 0} hợp đồng</span>
          </div>
        </div>
        <div className="summary-card">
          <h3>Vị trí đang tuyển</h3>
          <div className="summary-value">{analytics?.openRoles || 0}</div>
          <div className="summary-trend">
            <span className="positive">AI ưu tiên 4 vị trí</span>
            <span className="muted">Thời gian tuyển {analytics?.averageTimeToFill || 0} ngày</span>
          </div>
        </div>
        <div className="summary-card">
          <h3>Chỉ số ổn định</h3>
          <div className="summary-value">
            {formatPercent(insight?.workforceStabilityIndex || 0, { maximumFractionDigits: 0 })}
          </div>
          <div className="summary-trend">
            <span className="positive">Tăng 6 điểm</span>
            <span className="muted">
              Rủi ro nghỉ việc {formatPercent(analytics?.retentionRisk || 0, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <h3>Đa dạng đội ngũ</h3>
          <div className="summary-value">
            {formatPercent(analytics?.diversityRatio || 0, { maximumFractionDigits: 0 })}
          </div>
          <div className="summary-trend">
            <span className="neutral">Goal Q2: 50%</span>
            <span className="muted">AI đề xuất 2 chương trình DEI</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Pipeline tuyển dụng</h2>
          <span>Realtime AI scoring</span>
        </div>
        <div className="grid-two">
          <div className="table-like">
            <div className="table-row header">
              <span>Trạng thái</span>
              <span>Số lượng</span>
              <span>Tỷ trọng</span>
              <span>Tín hiệu AI</span>
            </div>
            {candidateByStage.map(([stage, count]) => {
              const total = candidates?.length || 1
              const percentage = Math.round((count / total) * 100)
              return (
                <div className="table-row" key={stage}>
                  <span className="highlight">{stage}</span>
                  <span>{count}</span>
                  <span>{percentage}%</span>
                  <span className="muted">{percentage > 25 ? 'Cần ưu tiên phỏng vấn' : 'Ổn định'}</span>
                </div>
              )
            })}
          </div>
          <div className="table-like">
            <div className="table-row header">
              <span>Ứng viên</span>
              <span>Điểm AI</span>
              <span>Trạng thái</span>
              <span>Kỹ năng trùng khớp</span>
            </div>
            {candidates?.slice(0, 5).map((candidate) => {
              const jobMatch = openJobs
                .flatMap(job => job.matches ?? [])
                .find(match => match.candidateId === candidate.id)
              return (
                <div className="table-row" key={candidate.id}>
                  <span>
                    <span className="highlight">{candidate.name}</span>
                    <br />
                    <span className="muted">{candidate.headline}</span>
                  </span>
                  <span>{jobMatch ? `${jobMatch.matchScore}/100` : `${candidate.interviewScore}/100`}</span>
                  <span>{candidate.status}</span>
                  <span className="muted">
                    {(jobMatch?.matchedSkills ?? candidate.skills.slice(0, 3)).join(', ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Vị trí mở & matching AI</h2>
          <span>{openJobs.length} vị trí đang mở</span>
        </div>
        <div className="section-content">
          {openJobs.map((job) => (
            <div className="table-like" key={job.id}>
              <div className="table-row header">
                <span>
                  <span className="highlight">{job.title}</span>
                  <br />
                  <span className="muted">{job.department} · {job.level}</span>
                </span>
                <span>{job.locations.join(' / ')}</span>
                <span>{formatCurrency(job.salaryRange[0])} - {formatCurrency(job.salaryRange[1])}</span>
                <span>{job.openings} headcount</span>
              </div>
              {(job.matches ?? []).map((match) => (
                <div className="table-row" key={match.candidateId}>
                  <span className="muted">Gợi ý: {match.candidateId}</span>
                  <span>{match.matchScore}/100</span>
                  <span className="muted">Trùng khớp: {match.matchedSkills.join(', ')}</span>
                  <span className="muted">Thiếu: {match.missingSkills.join(', ') || '—'}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>AI Insights tức thời</h2>
          <span>Generative Talent Intelligence</span>
        </div>
        <div className="ai-insights">
          <div className="ai-card">
            <h3>Talent Pulse</h3>
            <p className="muted">
              Đề xuất AI nhằm cải thiện sức khỏe tổ chức trong 30 ngày tới.
            </p>
            <ul>
              {insight?.hiringOpportunities?.map((item, index) => (
                <li key={index}>{item.recommendation}</li>
              ))}
            </ul>
          </div>
          <div className="ai-card">
            <h3>Automation Radar</h3>
            <p className="muted">Các quy trình nên kích hoạt AI Copilot.</p>
            <ul>
              {insight?.automationOpportunities?.map((item, index) => (
                <li key={index}>
                  <span className="highlight">{item.process}</span>: {item.aiAssist}
                </li>
              ))}
            </ul>
          </div>
          <div className="ai-card">
            <h3>Upskilling Map</h3>
            <p className="muted">Lộ trình học tập đề xuất dựa trên nhu cầu kỹ năng.</p>
            <ul>
              {insight?.learningSuggestions?.map((item, index) => (
                <li key={index}>
                  {item.skill} · {item.priority} priority cho {item.audience}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
