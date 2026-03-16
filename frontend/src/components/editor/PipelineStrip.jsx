import { motion, AnimatePresence } from 'framer-motion'

export default function PipelineStrip({ steps, onClear }) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="tu-pipeline">
      <span className="tu-pipeline-node tu-pipeline-node--input">Input</span>
      <AnimatePresence>
        {steps.map((step, i) => (
          <motion.div
            key={step.timestamp || i}
            style={{ display: 'flex', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <span className="tu-pipeline-arrow">→</span>
            <span className="tu-pipeline-node">{step.label}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      <span className="tu-pipeline-arrow">→</span>
      <span className="tu-pipeline-node tu-pipeline-node--output">Output</span>
      <button className="tu-pipeline-clear" onClick={onClear}>Clear</button>
    </div>
  )
}
