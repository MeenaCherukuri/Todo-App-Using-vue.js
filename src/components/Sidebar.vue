<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['toggle-dark-mode', 'logout'])

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Tasks', path: '/tasks', icon: '📝' },
  { name: 'Add Task', path: '/add-task', icon: '➕' },
  { name: 'Profile', path: '/profile', icon: '👤' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
]

const isActive = (path) => {
  return route.path === path
}

const displayName = computed(() => {
  return props.userName || props.name || props.currentUser?.name || 'User'
})
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">✓</span>
        <span class="logo-text">TodoApp</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in menuItems" :key="item.path">
          <router-link 
            :to="item.path" 
            :class="['nav-item', { active: isActive(item.path) }]"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar">
          {{ displayName.charAt(0).toUpperCase() }}
        </div>
        <div class="user-info">
          <span class="user-name">{{ displayName }}</span>
          <span class="user-role">Member</span>
        </div>
      </div>

      <div class="footer-actions">
        <button 
          class="theme-btn" 
          @click="$emit('toggle-dark-mode')"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span v-if="isDarkMode">☀️</span>
          <span v-else>🌙</span>
        </button>
        <button class="logout-btn" @click="$emit('logout')">
          🚪 Logout
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: var(--glass-shadow);
  border-right: 1px solid var(--glass-border);
  z-index: 100;
  transition: background-color 0.3s ease;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(234, 64, 164, 0.4);
}

.logo-text {
  color: var(--dark);
  font-size: 1.25rem;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0 0.75rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: var(--grey);
  text-decoration: none;
  border-radius: 0.75rem;
  margin-bottom: 0.25rem;
  transition: all var(--transition-smooth);
  font-weight: 500;
}

.nav-item:hover {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  color: var(--dark);
  transform: scale(1.02);
  box-shadow: var(--shadow-hover);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(234, 64, 164, 0.2) 0%, rgba(234, 64, 164, 0.1) 100%);
  color: var(--primary);
  font-weight: 600;
  border: 1px solid rgba(234, 64, 164, 0.3);
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  transition: transform var(--transition-base);
}

.nav-text {
  font-size: 0.9375rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--glass-border);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid var(--glass-border);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: 700;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: var(--dark);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.user-role {
  color: var(--grey);
  font-size: 0.75rem;
}

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.theme-btn,
.logout-btn {
  flex: 1;
  padding: 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.theme-btn {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--dark);
  border: 1px solid var(--glass-border);
}

.theme-btn:hover {
  background-color: var(--primary);
  transform: scale(1.02);
  box-shadow: var(--glow-subtle);
  color: white;
}

.theme-btn:hover span {
  transform: rotate(15deg);
}

.logout-btn {
  background: rgba(255, 91, 87, 0.1);
  color: var(--danger);
  border: 1px solid rgba(255, 91, 87, 0.2);
}

.logout-btn:hover {
  background-color: var(--danger);
  color: white;
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(255, 91, 87, 0.35);
}
</style>
