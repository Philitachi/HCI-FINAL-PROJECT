import React from 'react';
import './PageSkeletons.css';

const createItems = (count) => Array.from({ length: count }, (_, index) => index);

const SkeletonBlock = ({ className = '', as: Component = 'span' }) => (
  <Component className={`skeleton-block ${className}`.trim()} aria-hidden="true" />
);

export const ApplicationsListSkeleton = ({
  count = 4,
  showAction = true,
  showSecondaryAction = false,
}) => (
  <div
    className="applications-list skeleton-list"
    role="status"
    aria-live="polite"
    aria-label="Loading applications"
  >
    {createItems(count).map((index) => (
      <div key={`application-skeleton-${index}`} className="app-list-card skeleton-list-card skeleton-app-card">
        <div className="app-icon-container">
          <div className="app-icon-circle skeleton-icon-circle" />
        </div>

        <div className="app-card-content skeleton-card-content">
          <div className="app-title-row skeleton-title-row">
            <SkeletonBlock className="skeleton-line skeleton-line-title" />
            <SkeletonBlock className="skeleton-chip" />
          </div>

          <div className="app-details-col skeleton-details-col">
            <SkeletonBlock className="skeleton-line skeleton-line-medium" />
            <SkeletonBlock className="skeleton-line skeleton-line-long" />
            <div className="app-bottom-info skeleton-bottom-row">
              <SkeletonBlock className="skeleton-line skeleton-line-meta" />
              <SkeletonBlock className="skeleton-line skeleton-line-short" />
            </div>
          </div>
        </div>

        {showAction && (
          <div className="app-card-actions skeleton-card-actions">
            <SkeletonBlock className="skeleton-button skeleton-button-primary" />
            {showSecondaryAction && (
              <SkeletonBlock className="skeleton-button skeleton-button-secondary" />
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

export const DraftListSkeleton = ({ count = 4 }) => (
  <div
    className="skeleton-list"
    role="status"
    aria-live="polite"
    aria-label="Loading drafts"
  >
    {createItems(count).map((index) => (
      <div key={`draft-skeleton-${index}`} className="draft-list-card skeleton-list-card skeleton-draft-card">
        <div className="draft-icon-container">
          <div className="draft-icon-circle skeleton-icon-circle" />
        </div>

        <div className="draft-card-content skeleton-card-content">
          <div className="draft-title-row skeleton-title-row">
            <SkeletonBlock className="skeleton-line skeleton-line-title" />
            <SkeletonBlock className="skeleton-chip skeleton-chip-muted" />
          </div>

          <div className="draft-details-col skeleton-details-col">
            <SkeletonBlock className="skeleton-line skeleton-line-medium" />
            <SkeletonBlock className="skeleton-line skeleton-line-long" />
            <div className="draft-bottom-info skeleton-bottom-row">
              <SkeletonBlock className="skeleton-line skeleton-line-meta" />
              <SkeletonBlock className="skeleton-line skeleton-line-short" />
            </div>
          </div>
        </div>

        <div className="draft-card-actions skeleton-card-actions">
          <SkeletonBlock className="skeleton-button skeleton-button-primary" />
          <SkeletonBlock className="skeleton-button skeleton-button-secondary" />
        </div>
      </div>
    ))}
  </div>
);

export const EstablishmentListSkeleton = ({ count = 4 }) => (
  <div
    className="establishment-list skeleton-list"
    role="status"
    aria-live="polite"
    aria-label="Loading establishments"
  >
    {createItems(count).map((index) => (
      <div key={`establishment-skeleton-${index}`} className="est-list-card skeleton-list-card skeleton-establishment-card">
        <div className="est-icon-container">
          <div className="est-icon-circle skeleton-icon-circle" />
        </div>

        <div className="est-card-content skeleton-card-content">
          <div className="est-title-row skeleton-title-row">
            <SkeletonBlock className="skeleton-line skeleton-line-title" />
          </div>

          <div className="est-details-col skeleton-details-col">
            <SkeletonBlock className="skeleton-line skeleton-line-medium" />
            <SkeletonBlock className="skeleton-line skeleton-line-long" />
            <div className="est-bottom-info skeleton-bottom-row">
              <SkeletonBlock className="skeleton-line skeleton-line-meta" />
              <SkeletonBlock className="skeleton-line skeleton-line-short" />
            </div>
          </div>
        </div>

        <div className="est-card-actions skeleton-card-actions">
          <SkeletonBlock className="skeleton-line skeleton-line-short" />
        </div>
      </div>
    ))}
  </div>
);

export const SettingsSkeleton = () => (
  <div
    className="settings-content skeleton-settings-page"
    role="status"
    aria-live="polite"
    aria-label="Loading settings"
  >
    <div className="settings-nav-header">
      <SkeletonBlock className="skeleton-button skeleton-back-button" />
    </div>

    <div className="settings-header skeleton-header-group">
      <SkeletonBlock className="skeleton-page-title" />
      <SkeletonBlock className="skeleton-page-subtitle" />
    </div>

    <div className="settings-grid">
      <div className="settings-card profile-card skeleton-list-card skeleton-settings-card">
        <div className="skeleton-avatar" />
        <div className="profile-info skeleton-stack">
          <SkeletonBlock className="skeleton-line skeleton-name-line" />
          <SkeletonBlock className="skeleton-line skeleton-email-line" />
        </div>
        <SkeletonBlock className="skeleton-button skeleton-upload-button" />
      </div>

      <div className="settings-card info-card skeleton-list-card skeleton-settings-card">
        <SkeletonBlock className="skeleton-section-title" />
        <div className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <SkeletonBlock className="skeleton-field-label" />
              <div className="skeleton-input-shell" />
            </div>
            <div className="form-group">
              <SkeletonBlock className="skeleton-field-label" />
              <div className="skeleton-input-shell" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <SkeletonBlock className="skeleton-field-label" />
              <div className="skeleton-input-shell" />
            </div>
            <div className="form-group">
              <SkeletonBlock className="skeleton-field-label" />
              <div className="skeleton-input-shell" />
            </div>
          </div>

          <div className="form-group">
            <SkeletonBlock className="skeleton-field-label" />
            <div className="skeleton-input-shell" />
          </div>

          <SkeletonBlock className="skeleton-button skeleton-save-button" />
        </div>
      </div>
    </div>
  </div>
);

const FullDetailsSectionSkeleton = ({ fields, wideIndices = [] }) => (
  <div className="fd-section">
    <div className="fd-section-header">
      <SkeletonBlock className="skeleton-section-title" />
      <SkeletonBlock className="skeleton-page-subtitle skeleton-section-copy" />
    </div>

    <div className="fd-grid-2">
      {createItems(fields).map((index) => (
        <div
          key={`full-details-field-${fields}-${index}`}
          className={`fd-field ${wideIndices.includes(index) ? 'fd-col-span-2' : ''}`.trim()}
        >
          <SkeletonBlock className="skeleton-field-label" />
          <div className="fd-input-mock skeleton-input-shell" />
        </div>
      ))}
    </div>
  </div>
);

export const FullDetailsSkeleton = () => (
  <div
    className="fd-skeleton"
    role="status"
    aria-live="polite"
    aria-label="Loading application details"
  >
    <div className="fd-header-card skeleton-list-card skeleton-full-header">
      <div className="fd-header-left">
        <div className="fd-header-icon skeleton-icon-circle" />
        <div className="fd-header-titles skeleton-stack">
          <SkeletonBlock className="skeleton-page-title skeleton-full-title" />
          <SkeletonBlock className="skeleton-page-subtitle skeleton-full-subtitle" />
        </div>
      </div>
      <SkeletonBlock className="skeleton-chip skeleton-status-pill" />
    </div>

    <div className="fd-content-card skeleton-list-card skeleton-full-card">
      <div className="fd-ref-header skeleton-ref-row">
        <div className="skeleton-ref-dot" />
        <SkeletonBlock className="skeleton-line skeleton-ref-line" />
      </div>

      <div className="fd-tabs-container skeleton-tabs">
        {createItems(4).map((index) => (
          <SkeletonBlock key={`full-details-tab-${index}`} className="skeleton-tab" />
        ))}
      </div>

      <div className="fd-tab-content">
        <FullDetailsSectionSkeleton fields={6} wideIndices={[4]} />
        <FullDetailsSectionSkeleton fields={4} wideIndices={[3]} />
      </div>
    </div>
  </div>
);
