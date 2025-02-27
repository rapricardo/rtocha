interface IconProps {
  className?: string;
}

export default function AnalyticsIcon({ className = "" }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h14V5H5zm2 2h4v8H7V7zm6 0h4v10h-4V7z"/>
    </svg>
  );
}