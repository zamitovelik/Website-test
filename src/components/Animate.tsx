type AnimateProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
};

export default function Animate({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: AnimateProps) {
  const directionClasses = {
    up: 'animate-fade-up',
    down: 'animate-fade-down',
    left: 'animate-fade-left',
    right: 'animate-fade-right',
    scale: 'animate-fade-scale',
  };

  return (
    <div
      className={`opacity-0 ${directionClasses[direction]} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
