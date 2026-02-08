interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "podcast" | "book" | "article" | "personal_writing";
  onClick?: () => void;
}

const variantClasses = {
  default: "bg-[#f5efe8] text-[#6b6157] border border-[#e8e0d6]",
  podcast: "bg-amber-50 text-amber-800 border border-amber-200",
  book: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  article: "bg-sky-50 text-sky-800 border border-sky-200",
  personal_writing: "bg-violet-50 text-violet-800 border border-violet-200",
};

export default function Badge({
  children,
  variant = "default",
  onClick,
}: BadgeProps) {
  const classes = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variantClasses[variant]
  } ${onClick ? "cursor-pointer hover:opacity-80" : ""}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
