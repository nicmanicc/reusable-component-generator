import { LucideIcon } from "lucide-react";

interface InputWrapperProps {
  children: React.ReactNode;
  icon: LucideIcon;
  label: string;
  labelFor?: string;
}

export default function InputWrapper({ children, icon: Icon, label, labelFor }: InputWrapperProps) {
  return (
    <div>
      <label htmlFor={labelFor} className="block text-sm mb-2 text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
        {children}
      </div>
    </div>
  );
}