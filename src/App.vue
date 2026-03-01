<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Registration from './components/Registration.vue'
import Login from './components/Login.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import Sidebar from './components/Sidebar.vue'
import Dashboard from './views/Dashboard.vue'
import Tasks from './views/Tasks.vue'
import AddTask from './views/AddTask.vue'
import Profile from './views/Profile.vue'
import Settings from './views/Settings.vue'

const router = useRouter()

const todos = ref([])
const name = ref('')
const editingId = ref(null)

// Authentication state
const currentUser = ref(null)
const showRegistration = ref(false)
const showLogin = ref(false)
const showForgotPassword = ref(false)

// User name personalization
const userName = ref('')
const showNamePrompt = ref(false)

// Dark mode state
const isDarkMode = ref(false)

// Compute greeting based on time of day
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

// Check and load user name from localStorage
const loadUserName = () => {
  if (!currentUser.value) return
  
  const storedUserName = localStorage.getItem(`userName_${currentUser.value.id}`)
  if (storedUserName) {
    userName.value = storedUserName
  } else if (currentUser.value.name) {
    userName.value = currentUser.value.name
    localStorage.setItem(`userName_${currentUser.value.id}`, userName.value)
  } else {
    showNamePrompt.value = true
  }
}

// Toggle dark mode function
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value ? 'dark' : 'light')
  if (isDarkMode.value) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

// Initialize dark mode from localStorage
const initDarkMode = () => {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.body.classList.remove('dark')
  }
}

// Handle successful registration
const handleRegistrationSuccess = () => {
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
    name.value = currentUser.value.name || ''
    loadUserName()
  }
  showRegistration.value = false
  showLogin.value = false
  loadUserTodos()
}

// Handle successful login
const handleLoginSuccess = () => {
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
    name.value = currentUser.value.name || ''
    loadUserName()
  }
  showLogin.value = false
  showRegistration.value = false
  loadUserTodos()
}

// Handle navigation to login
const handleGoToLogin = () => {
  showRegistration.value = false
  showForgotPassword.value = false
  showLogin.value = true
}

// Handle navigation to registration
const handleGoToRegister = () => {
  showLogin.value = false
  showForgotPassword.value = false
  showRegistration.value = true
}

// Handle navigation to forgot password
const handleGoToForgotPassword = () => {
  showLogin.value = false
  showForgotPassword.value = true
}

// Handle password reset success
const handlePasswordResetSuccess = () => {
  showForgotPassword.value = false
  showLogin.value = true
}

// Logout function
const handleLogout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  name.value = ''
  userName.value = ''
  todos.value = []
  showLogin.value = true
  showRegistration.value = false
  showForgotPassword.value = false
  router.push('/')
}

// Check if user is authenticated
const isAuthenticated = computed(() => {
  return currentUser.value !== null
})

// Load todos for current user
const loadUserTodos = () => {
  try {
    const userTodos = JSON.parse(localStorage.getItem(`todos_${currentUser.value.id}`)) || []
    todos.value = userTodos
    todos.value.forEach(todo => {
      if (!todo.priority) {
        todo.priority = 'medium'
      }
    })
  } catch (e) {
    console.error('Error parsing todos from localStorage:', e)
    todos.value = []
  }
}

// Update todos from child components
const updateTodos = (newTodos) => {
  todos.value = newTodos
}

// Update name from Profile
const updateName = (newName) => {
  name.value = newName
  if (currentUser.value) {
    localStorage.setItem(`name_${currentUser.value.id}`, newName)
  }
}

const updateUserName = (newUserName) => {
  userName.value = newUserName
  if (currentUser.value) {
    localStorage.setItem(`userName_${currentUser.value.id}`, newUserName)
  }
}

onMounted(() => {
  initDarkMode()
  
  const user = localStorage.getItem('currentUser')
  if (user) {
    currentUser.value = JSON.parse(user)
    name.value = currentUser.value.name || ''
    loadUserName()
    loadUserTodos()
  } else {
    showLogin.value = true
  }
})

watch(todos, (newVal) => {
  if (currentUser.value) {
    localStorage.setItem(`todos_${currentUser.value.id}`, JSON.stringify(newVal))
  }
}, {
  deep: true
})

const saveUserName = () => {
  if (userName.value.trim() && currentUser.value) {
    localStorage.setItem(`userName_${currentUser.value.id}`, userName.value.trim())
    showNamePrompt.value = false
  }
}

const closeNamePrompt = () => {
  if (!userName.value.trim() && currentUser.value?.name) {
    userName.value = currentUser.value.name
  }
  showNamePrompt.value = false
}
</script>

<template>
  <!-- Auth Components: Show only one at a time with correct priority -->
  <Login 
    v-if="showLogin || (!isAuthenticated && !showRegistration && !showForgotPassword)" 
    @login-success="handleLoginSuccess"
    @go-to-register="handleGoToRegister"
    @go-to-forgot-password="handleGoToForgotPassword"
  />
  
  <ForgotPassword
    v-else-if="showForgotPassword"
    @password-reset-success="handlePasswordResetSuccess"
    @back-to-login="handleGoToLogin"
  />

  <Registration 
    v-else-if="showRegistration"
    @registration-success="handleRegistrationSuccess"
    @go-to-login="handleGoToLogin"
  />
  
  <!-- SaaS Layout with Sidebar -->
  <div v-else class="app-layout">
    <!-- Name Prompt Modal -->
    <div v-if="showNamePrompt" class="name-prompt-overlay">
      <div class="name-prompt-modal">
        <h3>Welcome! 👋</h3>
        <p>Please enter your name for a personalized greeting:</p>
        <input 
          type="text" 
          v-model="userName" 
          placeholder="Enter your name"
          @keyup.enter="saveUserName"
          autofocus
        />
        <div class="name-prompt-actions">
          <button @click="saveUserName" class="save-name-btn">Save</button>
          <button @click="closeNamePrompt" class="skip-name-btn">Skip</button>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <Sidebar 
      :is-dark-mode="isDarkMode"
      :user-name="userName"
      :name="name"
      :current-user="currentUser"
      @toggle-dark-mode="toggleDarkMode"
      @logout="handleLogout"
    />

    <!-- Main Content -->
    <main class="main-content">
      <Dashboard 
        :todos="todos"
        :user-name="userName"
        :name="name"
        :current-user="currentUser"
        v-if="$route.path === '/'"
      />
      <Tasks 
        :todos="todos"
        @update:todos="updateTodos"
        v-else-if="$route.path === '/tasks'"
      />
      <AddTask 
        :todos="todos"
        @update:todos="updateTodos"
        v-else-if="$route.path === '/add-task'"
      />
      <Profile 
        :current-user="currentUser"
        :user-name="userName"
        :name="name"
        :todos="todos"
        @update:name="updateName"
        @update:userName="updateUserName"
        v-else-if="$route.path === '/profile'"
      />
      <Settings 
        :is-dark-mode="isDarkMode"
        @toggle-dark-mode="toggleDarkMode"
        v-else-if="$route.path === '/settings'"
      />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  min-height: 100vh;
  overflow-y: auto;
}

/* Name Prompt Modal Styles */
.name-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.name-prompt-modal {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.name-prompt-modal h3 {
  color: var(--dark);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.name-prompt-modal p {
  color: var(--grey);
  margin-bottom: 1.5rem;
}

.name-prompt-modal input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--light);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: var(--dark);
  background-color: var(--light);
}

.name-prompt-modal input:focus {
  outline: none;
  border-color: var(--primary);
}

.name-prompt-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.save-name-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.save-name-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(234, 64, 164, 0.4);
}

.skip-name-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--light);
  color: var(--dark);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}

.skip-name-btn:hover {
  background-color: var(--grey);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }
}
</style>
