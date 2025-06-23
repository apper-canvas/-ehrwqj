import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = 'bg-surface-100 rounded-xl p-6 shadow-sm border border-surface-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';

  const MotionDiv = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <MotionDiv
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...(hover ? motionProps : {})}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

export default Card;