interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "podcast" | "book" | "article" | "personal_writing";
  onClick?: () => void;
}

const variantClasses = {
  default: "bg-slate-100 text-slate-700",
  podcast: "bg-amber-100 text-amber-800",
  book: "bg-emerald-100 text-emerald-800",
  article: "bg-blue-100 text-blue-800",
  personal_writing: "bg-purple-100 text-purple-800",
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
