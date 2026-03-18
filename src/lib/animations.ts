export const fadeUp = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as any } },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
}

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] as any } },
}

export const scalePress = {
  tap: { scale: 0.97, transition: { duration: 0.1 } },
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const skeletonToContent = {
  initial: { scale: 0.98, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
}
