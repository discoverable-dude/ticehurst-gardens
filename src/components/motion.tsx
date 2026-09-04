'use client'

import { ReactNode } from 'react'
import {
  motion,
  useReducedMotion,
  type Variants,
  type HTMLMotionProps,
} from 'motion/react'

/* ── Stagger wrapper ─────────────────────────────────────── */

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.25, duration: 0.9 },
  },
}

export function AnimatedGroup({
  children,
  className,
  viewport = true,
}: {
  children: ReactNode
  className?: string
  viewport?: boolean
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  const vpProps = viewport
    ? { whileInView: 'visible' as const, viewport: { once: true, margin: '-60px' } }
    : { animate: 'visible' as const }

  return (
    <motion.div
      initial="hidden"
      variants={staggerContainer}
      className={className}
      {...vpProps}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={staggerItem} className={className} {...rest}>
      {children}
    </motion.div>
  )
}

/* ── Generic fade-in ─────────────────────────────────────── */

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.6,
  viewport = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  viewport?: boolean
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  const vpProps = viewport
    ? { whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' }, viewport: { once: true, margin: '-60px' } }
    : { animate: { opacity: 1, y: 0, filter: 'blur(0px)' } }

  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
      {...vpProps}
    >
      {children}
    </motion.div>
  )
}

/* ── Hover-lift card wrapper ─────────────────────────────── */

export function HoverLift({
  children,
  className,
  y = -6,
}: {
  children: ReactNode
  className?: string
  y?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      whileHover={{ y, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  )
}
