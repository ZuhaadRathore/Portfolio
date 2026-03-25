'use client'

import styles from './marquee.module.css'

export default function Marquee() {
  const tags = [
    'ENGINEERING THE ABSTRACT',
    'DIGITAL CRAFTSMANSHIP',
    'BRIDGING LOGIC & CHAOS',
    'SYSTEM ARCHITECTURE'
  ]

  const content = tags.map((tag, i) => (
    <span key={i} className={styles.marqueeItem}>
      <span className={styles.marqueeTag}>{tag}</span>
      <span className={styles.marqueeSeparator}>+++</span>
    </span>
  ))

  return (
    <div className={styles.marqueeWrapper}>
      <div className={styles.marqueeContent}>
        {content}
        {content}
      </div>
      <div className={styles.marqueeContent} aria-hidden="true">
        {content}
        {content}
      </div>
    </div>
  )
}
