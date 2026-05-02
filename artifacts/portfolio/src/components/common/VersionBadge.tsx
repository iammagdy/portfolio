import { useState } from 'react';

const VersionBadge = () => {
  const [expanded, setExpanded] = useState(false);

  const version = `v${__APP_VERSION__}`;
  const commit = __APP_COMMIT__;
  const buildDate = __APP_BUILD_DATE__;

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="fixed bottom-2 right-2 z-50 font-sans text-white pointer-events-auto select-none transition-opacity duration-300 hover:opacity-90"
      style={{
        fontSize: '0.6rem',
        opacity: expanded ? 0.85 : 0.35,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        padding: '2px 6px',
        borderRadius: '3px',
        letterSpacing: '0.05em',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label={`Version ${version}, commit ${commit}, built ${buildDate}`}
      title={`Build ${commit} • ${buildDate}`}
    >
      {expanded ? `${version} · ${commit} · ${buildDate}` : version}
    </button>
  );
};

export default VersionBadge;
