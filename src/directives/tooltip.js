/**
 * Tooltip Directive for Vue 3
 * Usage: v-tooltip="'tooltip text'" or v-tooltip.top="'text on top'"
 */

const tooltipStyles = `
  .tooltip {
    position: absolute;
    z-index: 9999;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    color: #fff;
    background-color: #333;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .tooltip.visible {
    opacity: 1;
  }
  
  .tooltip::before {
    content: '';
    position: absolute;
    border-width: 6px;
    border-style: solid;
  }
  
  /* Top tooltip */
  .tooltip.tooltip-top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
  }
  
  .tooltip.tooltip-top.visible {
    transform: translateX(-50%) translateY(0);
  }
  
  .tooltip.tooltip-top::before {
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-color: #333 transparent transparent transparent;
  }
  
  /* Bottom tooltip */
  .tooltip.tooltip-bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
  }
  
  .tooltip.tooltip-bottom.visible {
    transform: translateX(-50%) translateY(0);
  }
  
  .tooltip.tooltip-bottom::before {
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-color: transparent transparent #333 transparent;
  }
  
  /* Left tooltip */
  .tooltip.tooltip-left {
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(4px);
  }
  
  .tooltip.tooltip-left.visible {
    transform: translateY(-50%) translateX(0);
  }
  
  .tooltip.tooltip-left::before {
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-color: transparent transparent transparent #333;
  }
  
  /* Right tooltip */
  .tooltip.tooltip-right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) translateX(-4px);
  }
  
  .tooltip.tooltip-right.visible {
    transform: translateY(-50%) translateX(0);
  }
  
  .tooltip.tooltip-right::before {
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    border-color: transparent #333 transparent transparent;
  }
  
  /* Tooltip types */
  .tooltip.tooltip-danger {
    background-color: #EF4444;
  }
  
  .tooltip.tooltip-danger::before {
    border-color: #EF4444 transparent transparent transparent;
  }
  
  .tooltip.tooltip-warning {
    background-color: #F59E0B;
  }
  
  .tooltip.tooltip-warning::before {
    border-color: #F59E0B transparent transparent transparent;
  }
  
  .tooltip.tooltip-success {
    background-color: #10B981;
  }
  
  .tooltip.tooltip-success::before {
    border-color: #10B981 transparent transparent transparent;
  }
  
  .tooltip.tooltip-info {
    background-color: #3B82F6;
  }
  
  .tooltip.tooltip-info::before {
    border-color: #3B82F6 transparent transparent transparent;
  }
`

let tooltipId = 0
const tooltips = new Map()

function injectStyles() {
  if (document.getElementById('tooltip-styles')) return
  
  const style = document.createElement('style')
  style.id = 'tooltip-styles'
  style.textContent = tooltipStyles
  document.head.appendChild(style)
}

function createTooltip(el, binding) {
  injectStyles()
  
  const value = binding.value
  if (!value) return
  
  const position = binding.arg || 'top'
  const tooltipType = binding.modifiers.danger ? 'tooltip-danger' : 
                      binding.modifiers.warning ? 'tooltip-warning' :
                      binding.modifiers.success ? 'tooltip-success' :
                      binding.modifiers.info ? 'tooltip-info' : ''
  
  const tooltip = document.createElement('div')
  tooltip.className = `tooltip tooltip-${position} ${tooltipType}`
  tooltip.id = `tooltip-${++tooltipId}`
  tooltip.textContent = value
  
  el.appendChild(tooltip)
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  
  tooltips.set(el, tooltip)
}

function showTooltip(el) {
  const tooltip = tooltips.get(el)
  if (tooltip) {
    tooltip.classList.add('visible')
  }
}

function hideTooltip(el) {
  const tooltip = tooltips.get(el)
  if (tooltip) {
    tooltip.classList.remove('visible')
  }
}

function updateTooltip(el, binding) {
  const tooltip = tooltips.get(el)
  if (tooltip && binding.value) {
    tooltip.textContent = binding.value
  }
}

function removeTooltip(el) {
  const tooltip = tooltips.get(el)
  if (tooltip) {
    tooltip.remove()
    tooltips.delete(el)
  }
}

export default {
  mounted(el, binding) {
    createTooltip(el, binding)
    
    el.addEventListener('mouseenter', () => showTooltip(el))
    el.addEventListener('mouseleave', () => hideTooltip(el))
  },
  updated(el, binding) {
    updateTooltip(el, binding)
  },
  unmounted(el) {
    el.removeEventListener('mouseenter', () => showTooltip(el))
    el.removeEventListener('mouseleave', () => hideTooltip(el))
    removeTooltip(el)
  }
}
