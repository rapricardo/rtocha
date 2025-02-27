interface IconProps {
  className?: string;
}

export default function LeadIcon({ className = "" }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 2a4.5 4.5 0 00-4.5-4.5 4.5 4.5 0 00-4.5 4.5v.5h9v-.5z"/>
      <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16z"/>
    </svg>
  );
}