import { useState } from 'react';

const VersionBadge = () => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const version = `v${__APP_VERSION__}`;
  const commit = __APP_COMMIT__;
  const buildDate = __APP_BUILD_DATE__;

  const visibleOpacity = expanded ? 0.7 : hovered ? 0.4 : 0.18;

  return (
    <div
      className="fixed bottom-2 right-3 z-50 pointer-events-none select-none"
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: '0.55rem',
        letterSpacing: '0.08em',
        color: 'white',
        textShadow: '0 0 2px rgba(0,0,0,0.6)',
        mixBlendMode: 'difference',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="pointer-events-auto bg-transparent border-0 p-0 m-0 cursor-pointer transition-opacity duration-300"
        style={{
          opacity: visibleOpacity,
          color: 'inherit',
          font: 'inherit',
          letterSpacing: 'inherit',
        }}
        aria-label={`Version ${version}, commit ${commit}, built ${buildDate}`}
        title={`${version} · ${commit} · ${buildDate}`}
      >
        {expanded ? `${version} · ${commit} · ${buildDate}` : version}
      </button>
    </div>
  );
};

export default VersionBadge;
