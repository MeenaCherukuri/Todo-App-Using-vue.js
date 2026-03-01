<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  },
  userName: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  todos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:userName', 'update:name'])

const isEditingName = ref(false)
const editedName = ref(props.name || props.userName || '')

const totalTasks = props.todos.length
const completedTasks = props.todos.filter(t => t.done).length
const professionalTasks = props.todos.filter(t => t.category === 'professional').length
const personalTasks = props.todos.filter(t => t.category === 'personal').length

const startEditing = () => {
  editedName.value = props.name || props.userName || ''
  isEditingName.value = true
}

const saveName = () => {
  if (editedName.value.trim()) {
    emit('update:name', editedName.value.trim())
    emit('update:userName', editedName.value.trim())
  }
  isEditingName.value = false
}

const cancelEditing = () => {
  isEditingName.value = false
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="avatar">
        <span class="avatar-icon">👤</span>
      </div>
      <div class="profile-info">
        <div v-if="!isEditingName" class="name-display">
          <h2>{{ userName || name || currentUser?.name || 'User' }}</h2>
          <button class="edit-name-btn" @click="startEditing">✏️ Edit</button>
        </div>
        <div v-else class="name-edit">
          <input 
            type="text" 
            v-model="editedName" 
            placeholder="Enter your name"
            @keyup.enter="saveName"
            autofocus 
          />
          <button class="save-btn" @click="saveName">Save</button>
          <button class="cancel-btn" @click="cancelEditing">Cancel</button>
        </div>
        <p class="email">{{ currentUser?.email || 'user@example.com' }}</p>
      </div>
    </div>

    <div class="profile-stats">
      <h3>Your Statistics</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-icon">📋</span>
          <span class="stat-number">{{ totalTasks }}</span>
          <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">✅</span>
          <span class="stat-number">{{ completedTasks }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💼</span>
          <span class="stat-number">{{ professionalTasks }}</span>
          <span class="stat-label">Professional</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🏠</span>
          <span class="stat-number">{{ personalTasks }}</span>
          <span class="stat-label">Personal</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h3>Account Information</h3>
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Member Since</span>
          <span class="info-value">{{ currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A' }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">User ID</span>
          <span class="info-value">#{{ currentUser?.id || 'N/A' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  width: 100%;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  margin-bottom: 1.5rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(234, 64, 164, 0.4);
}

.avatar-icon {
  font-size: 3rem;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.email {
  color: var(--grey);
  font-size: 0.875rem;
}

.name-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.edit-name-btn {
  padding: 0.25rem 0.75rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--dark);
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  border: 1px solid var(--glass-border);
}

.edit-name-btn:hover {
  background: var(--glass-bg-strong);
}

.name-edit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.name-edit input {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: var(--dark);
  background-color: var(--light);
  border-radius: 0.5rem;
  border: 2px solid var(--primary);
}

.name-edit input:focus {
  outline: none;
}

.save-btn {
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: #fff;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.save-btn:hover {
  opacity: 0.85;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: var(--grey);
  color: #fff;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.cancel-btn:hover {
  background-color: var(--dark);
}

.profile-stats {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  margin-bottom: 1.5rem;
}

.profile-stats h3 {
  color: var(--dark);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;
  border: 1px solid var(--glass-border);
}

.stat-item:hover {
  transform: translateY(-4px);
  background: var(--glass-bg-strong);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
}

.stat-label {
  color: var(--grey);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.profile-section {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
}

.profile-section h3 {
  color: var(--dark);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.info-card {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--glass-border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--grey);
  font-size: 0.875rem;
  font-weight: 500;
}

.info-value {
  color: var(--dark);
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .name-display {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
