<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['registration-success', 'go-to-login'])

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isRegistered = ref(false)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validate form fields
const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  // Name validation
  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
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
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  // Confirm Password validation
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
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

  // Check if email already exists
  const emailExists = existingUsers.some(
    user => user.email.toLowerCase() === formData.value.email.toLowerCase()
  )

  if (emailExists) {
    errors.value.email = 'This email is already registered'
    return
  }

  // Create new user object (without storing plain password in real apps - for demo only)
  const newUser = {
    id: Date.now(),
    name: formData.value.name.trim(),
    email: formData.value.email.toLowerCase().trim(),
    password: formData.value.password, // In production, this should be hashed!
    createdAt: new Date().toISOString()
  }

  // Add to existing users array
  existingUsers.push(newUser)
  localStorage.setItem('users', JSON.stringify(existingUsers))

  // Set current user as logged in
  localStorage.setItem('currentUser', JSON.stringify({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  }))

  // Emit success event to parent
  emit('registration-success')
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
  <div class="registration-container">
    <div class="registration-card">
      <h2 class="registration-title">Create Account</h2>
      <p class="registration-subtitle">Join us and start managing your todos</p>

      <form @submit.prevent="handleSubmit" class="registration-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            placeholder="Enter your full name"
            :class="{ 'input-error': errors.name }"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

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
            placeholder="Create a password"
            :class="{ 'input-error': errors.password }"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            placeholder="Confirm your password"
            :class="{ 'input-error': errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="register-btn">Create Account</button>

        <!-- Login Link -->
        <p class="login-link">
          Already have an account? <a href="#" @click.prevent="emit('go-to-login')">Login here</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--gradient-bg);
  transition: background 0.3s ease;
}

.dark .registration-container {
  background: var(--gradient-bg);
}

.registration-card {
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

.dark .registration-card {
  background: var(--glass-bg-strong);
}

.registration-title {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.registration-subtitle {
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

.register-btn {
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

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(234, 64, 164, 0.4);
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--grey);
  font-size: 0.875rem;
}

.login-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
