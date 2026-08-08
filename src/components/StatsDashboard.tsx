import React from 'react';
import './StatsDashboard.css';

interface StatsDashboardProps {
  totalLinks: number;
  totalClicks: number;
  mostActiveCode: string | null;
  mostActiveClicks: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  totalLinks,
  totalClicks,
  mostActiveCode,
  mostActiveClicks,
}) => {
  return (
    <section className="stats-section">
      {/* Total Clicks Card */}
      <div className="stats-card-widget">
        <div className="stats-card-header-row">
          <span className="material-symbols-outlined stats-card-header-icon">ads_click</span>
          <h3 className="stats-card-header-label">Total Clicks</h3>
        </div>
        <div className="stats-card-widget-value">{totalClicks.toLocaleString()}</div>
        <div className="stats-card-widget-desc">Total redirect traffic generated</div>
      </div>

      {/* Active Links Card */}
      <div className="stats-card-widget">
        <div className="stats-card-header-row">
          <span className="material-symbols-outlined stats-card-header-icon">link</span>
          <h3 className="stats-card-header-label">Active Links</h3>
        </div>
        <div className="stats-card-widget-value">{totalLinks}</div>
        <div className="stats-card-widget-desc">Total active shortcodes in manager</div>
      </div>

      {/* Top Performing Link Card */}
      <div className="stats-card-widget">
        <div className="stats-card-header-row">
          <span className="material-symbols-outlined stats-card-header-icon">local_fire_department</span>
          <h3 className="stats-card-header-label">Most Active</h3>
        </div>
        {mostActiveCode ? (
          <>
            <div className="stats-card-widget-value">/{mostActiveCode}</div>
            <div className="stats-card-widget-desc">
              Leading with <strong>{mostActiveClicks}</strong> clicks
            </div>
          </>
        ) : (
          <>
            <div className="stats-card-widget-value">—</div>
            <div className="stats-card-widget-desc">No click activity registered yet</div>
          </>
        )}
      </div>
    </section>
  );
};
