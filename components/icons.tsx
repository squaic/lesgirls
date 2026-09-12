import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
export function HomeIcon(props: IconProps) { return <svg {...common} {...props}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></svg>; }
export function PlusIcon(props: IconProps) { return <svg {...common} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>; }
export function UserIcon(props: IconProps) { return <svg {...common} {...props}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>; }
export function ArrowLeftIcon(props: IconProps) { return <svg {...common} {...props}><path d="m15 18-6-6 6-6"/></svg>; }
export function ExternalLinkIcon(props: IconProps) { return <svg {...common} {...props}><path d="M15 4h5v5M10 14 20 4M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6"/></svg>; }
export function LinkIcon(props: IconProps) { return <svg {...common} {...props}><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/></svg>; }
export function BookIcon(props: IconProps) { return <svg {...common} {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z"/></svg>; }
export function FilmIcon(props: IconProps) { return <svg {...common} {...props}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4"/></svg>; }
export function SeriesIcon(props: IconProps) { return <svg {...common} {...props}><rect x="4" y="6" width="16" height="13" rx="1.5"/><path d="m9 2 3 4 3-4M9 10l6 3-6 3Z"/></svg>; }
export function MapPinIcon(props: IconProps) { return <svg {...common} {...props}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
