import { useState } from 'react';

/**
 * Tabs — equivalente ao switchTab() do antigo app.js.
 * @param {{id: string, label: string, content: React.ReactNode}[]} tabs
 */
export default function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${active === tab.id ? 'active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={tab.id}
          className={`tab-content ${active === tab.id ? 'active' : ''}`}
          style={{ display: active === tab.id ? 'block' : 'none' }}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
