<script setup>
import { computed } from 'vue'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-dark-mode'])

const toggleDarkMode = () => {
  emit('toggle-dark-mode')
}
</script>

<template>
  <div class="settings-view">
    <div class="settings-header">
      <h2>Settings</h2>
      <p>Manage your application preferences</p>
    </div>

    <div class="settings-section">
      <h3>Appearance</h3>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
          <div class="setting-text">
            <span class="setting-title">Dark Mode</span>
            <span class="setting-description">Switch between light and dark themes</span>
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="settings-section">
      <h3>About</h3>
      <div class="about-card">
        <div class="app-info">
          <h4>Todo App</h4>
          <p class="version">Version 1.0.0</p>
        </div>
        <p class="description">
          A modern SaaS-style todo application built with Vue 3. 
          Organize your professional and personal tasks efficiently.
        </p>
        <div class="features-list">
          <div class="feature">
            <span>✅</span> Task Management
          </div>
          <div class="feature">
            <span>✅</span> Priority Levels
          </div>
          <div class="feature">
            <span>✅</span> Search & Filter
          </div>
          <div class="feature">
            <span>✅</span> Dark Mode
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h3>Data Management</h3>
      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-icon">💾</span>
          <div class="setting-text">
            <span class="setting-title">Local Storage</span>
            <span class="setting-description">Your data is stored locally in your browser</span>
          </div>
        </div>
        <span class="status-badge active">Active</span>
      </div>
    </div>

    <div class="settings-section">
      <h3>Keyboard Shortcuts</h3>
      <div class="shortcuts-list">
        <div class="shortcut">
          <span class="key">Enter</span>
          <span class="action">Save / Submit</span>
        </div>
        <div class="shortcut">
          <span class="key">Escape</span>
          <span class="action">Cancel / Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  width: 100%;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-header h2 {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: var(--grey);
  font-size: 0.875rem;
}

/* Settings Section - Glassmorphism */
.settings-section {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  margin-bottom: 1.5rem;
}

.settings-section h3 {
  color: var(--dark);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--glass-border);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-icon {
  font-size: 1.5rem;
}

.setting-text {
  display: flex;
  flex-direction: column;
}

.setting-title {
  color: var(--dark);
  font-size: 1rem;
  font-weight: 600;
}

.setting-description {
  color: var(--grey);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--light);
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .slider {
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(28px);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

/* About Card - Glassmorphism */
.about-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--glass-border);
}

.app-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.app-info h4 {
  color: var(--dark);
  font-size: 1.25rem;
  font-weight: 700;
}

.version {
  color: var(--grey);
  font-size: 0.75rem;
  background: rgba(234, 64, 164, 0.15);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.description {
  color: var(--grey);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.features-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark);
  font-size: 0.875rem;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  border: 1px solid var(--glass-border);
}

.key {
  padding: 0.25rem 0.75rem;
  background-color: var(--dark);
  color: var(--light);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.action {
  color: var(--grey);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .features-list {
    grid-template-columns: 1fr;
  }
}
</style>
