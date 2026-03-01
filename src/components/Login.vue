<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['login-success', 'go-to-register'])

const formData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validate form fields
const validateForm = () => {
  let isValid = true
  errors.value = {
    email: '',
    password: ''
  }

  // Email validation
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  // Get existing users from localStorage
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

  // Find user with matching email (case-insensitive)
  const user = existingUsers.find(
    user => user.email.toLowerCase() === formData.value.email.toLowerCase()
  )

  // Check if user exists
  if (!user) {
    errors.value.email = 'No account found with this email address'
    return
  }

  // Check if password matches
  if (user.password !== formData.value.password) {
    errors.value.password = 'Incorrect password'
    return
  }

  // Set current user as logged in (without password)
  localStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email
  }))

  // Emit success event to parent
  emit('login-success')
}

// Initialize dark mode on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme === 'dark') {
    document.body.classList.add('dark')
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Welcome Back</h2>
      <p class="login-subtitle">Login to manage your todos</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="Enter your email"
            :class="{ 'input-error': errors.email }"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            placeholder="Enter your password"
            :class="{ 'input-error': errors.password }"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="login-btn">Login</button>

        <!-- Register Link -->
        <p class="register-link">
          Don't have an account? <a href="#" @click.prevent="emit('go-to-register')">Register here</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--gradient-bg);
  transition: background 0.3s ease;
}

.dark .login-container {
  background: var(--gradient-bg);
}

.login-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  transition: background-color 0.3s ease;
}

.dark .login-card {
  background: var(--glass-bg-strong);
}

.login-title {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: var(--grey);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  color: var(--dark);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input {
  display: block;
  width: 100%;
  font-size: 1rem;
  padding: 0.875rem 1rem;
  color: var(--dark);
  background-color: var(--light);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--card-bg);
}

.form-group input.input-error {
  border-color: var(--danger);
}

.form-group input::placeholder {
  color: var(--grey);
}

.error-message {
  display: block;
  color: var(--danger);
  font-size: 0.75rem;
  margin-top: 0.375rem;
  font-weight: 500;
}

.login-btn {
  display: block;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem;
  color: #fff;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-top: 1.5rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(234, 64, 164, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--grey);
  font-size: 0.875rem;
}

.register-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
