interface IconProps {
  className?: string;
}

export default function IntegrationIcon({ className = "" }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1h18zm0-3H3v-3h18v3zm0-8v5H3V7a2 2 0 012-2h14a2 2 0 012 2zm-12 3H7V8h2v2z"/>
    </svg>
  );
}