import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

export default function Header({ title, icon: Icon, children }: Props) {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h3 className="text-slate-900 dark:text-white">{title}</h3>
        {children && <div className="ml-auto">{children}</div>}
      </div>
    </div>
  );
}