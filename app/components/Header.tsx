import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export default function Header({ title, icon: Icon, children }: Props) {
  return (
    <div className="px-5 py-3 border-b border-rule bg-parchment">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-mid" />
        <span className="text-[0.6rem] tracking-[0.2em] uppercase text-mid font-medium">
          {title}
        </span>
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </div>
  );
}
