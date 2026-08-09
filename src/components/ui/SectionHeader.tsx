import React from "react";

interface SectionHeaderProps {
  title: string;
  kicker?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export default function SectionHeader({
  title,
  kicker,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`section__head inset ${action ? "section__head--has-action" : ""} ${className}`.trim()}>
      <div className="section__head-content">
        {kicker && <span className="utility section__kicker">{kicker}</span>}
        <h2 className="heading" data-reveal>
          {title}
        </h2>
      </div>
      {action && (
        <a className="link-arrow utility" href={action.href}>
          {action.label}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 8h12M9 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
