<script setup>
import { computed } from 'vue'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  userName: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) {
    return 'Good Morning'
  } else if (hour < 18) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
})

const totalTasksCount = computed(() => props.todos.length)

const completedTasksCount = computed(() => {
  return props.todos.filter(todo => todo.done).length
})

const overdueTasksCount = computed(() => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return props.todos.filter(todo => {
    if (!todo.deadline || todo.done) return false
    const deadlineDate = new Date(todo.deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    return deadlineDate < now
  }).length
})

const completionPercentage = computed(() => {
  if (props.todos.length === 0) return 0
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100)
})
</script>

<template>
  <div class="dashboard-view">
    <section class="greeting">
      <h2 class="title">
        {{ greeting }}, {{ userName || name || currentUser?.name }}! What's on your mind?
      </h2>
    </section>

    <section class="dashboard">
      <h3>DASHBOARD</h3>
      <div class="dashboard-stats">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTasksCount }}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
        </div>
        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-value">{{ completedTasksCount }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
        <div class="stat-card overdue" v-tooltip="overdueTasksCount > 0 ? `${overdueTasksCount} task(s) overdue` : 'No overdue tasks'">
          <div class="stat-icon">⚠️</div>
          <div class="stat-info">
            <span class="stat-value">{{ overdueTasksCount }}</span>
            <span class="stat-label">Overdue</span>
          </div>
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Completion Progress</span>
          <span class="progress-percentage">{{ completionPercentage }}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: completionPercentage + '%' }"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-view {
  width: 100%;
}

.greeting {
  margin-bottom: 1.5rem;
}

.greeting .title {
  color: var(--dark);
  font-size: 1.5rem;
  font-weight: 700;
}

/* Dashboard Section - Glassmorphism Style */
.dashboard {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.dashboard:hover {
  box-shadow: var(--shadow-card-hover);
  background: var(--glass-bg-strong);
}

.dashboard h3 {
  margin-bottom: 1.25rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--grey);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

/* Glassmorphism Stat Cards */
.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all var(--transition-smooth);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.stat-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
}

.stat-card.total::before {
  background: linear-gradient(180deg, #3A82EE 0%, #2563EB 100%);
}

.stat-card.completed::before {
  background: linear-gradient(180deg, #10B981 0%, #059669 100%);
}

.stat-card.overdue::before {
  background: linear-gradient(180deg, #EF4444 0%, #DC2626 100%);
}

.stat-card {
  box-shadow: var(--glass-shadow);
}

.stat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-card-hover);
  background: var(--glass-bg-strong);
}

.stat-card.total:hover {
  box-shadow: 0 12px 32px rgba(58, 130, 238, 0.25);
}

.stat-card.completed:hover {
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.25);
}

.stat-card.overdue:hover {
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.25);
}

.stat-card.total {
  background: linear-gradient(135deg, rgba(58, 130, 238, 0.15) 0%, rgba(58, 130, 238, 0.05) 100%);
}

.stat-card.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.stat-card.overdue {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.stat-card .stat-icon {
  font-size: 2.25rem;
  margin-right: 1rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, rgba(58, 130, 238, 0.2) 0%, rgba(58, 130, 238, 0.1) 100%);
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
}

.stat-card.overdue .stat-icon {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%);
}

.stat-card .stat-info {
  display: flex;
  flex-direction: column;
}

.stat-card .stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--dark);
  line-height: 1.2;
}

.stat-card .stat-label {
  font-size: 0.875rem;
  color: var(--grey);
  font-weight: 500;
  margin-top: 0.25rem;
}

/* Progress Section - Glassmorphism */
.progress-section {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.progress-section:hover {
  background: var(--glass-bg-strong);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--dark);
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--professional) 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.progress-bar-container {
  width: 100%;
  height: 14px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 7px;
  overflow: hidden;
  position: relative;
}

.progress-bar-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  pointer-events: none;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--professional) 0%, #8B5CF6 50%, var(--primary) 100%);
  border-radius: 7px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(58, 130, 238, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2);
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem 1.25rem;
  }
  
  .stat-card .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-card .stat-icon {
    font-size: 1.75rem;
    width: 40px;
    height: 40px;
  }
}
</style>
