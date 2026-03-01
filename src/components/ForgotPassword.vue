<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['password-reset-success', 'back-to-login'])

const formData = ref({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref({
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const successMessage = ref('')
const isLoading = ref(false)

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validate form fields
const validateForm = () => {
  let isValid = true
  errors.value = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  }

  // Email validation
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // New password validation
  if (!formData.value.newPassword) {
    errors.value.newPassword = 'New password is required'
    isValid = false
  } else if (formData.value.newPassword.length < 6) {
    errors.value.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  // Confirm password validation
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.value.newPassword !== formData.value.confirmPassword) {
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

  isLoading.value = true

  // Get existing users from localStorage
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

  // Find user with matching email (case-insensitive)
  const userIndex = existingUsers.findIndex(
    user => user.email.toLowerCase() === formData.value.email.toLowerCase()
  )

  // Check if user exists
  if (userIndex === -1) {
    errors.value.email = 'No account found with this email address'
    isLoading.value = false
    return
  }

  // Update the user's password
  existingUsers[userIndex].password = formData.value.newPassword
  localStorage.setItem('users', JSON.stringify(existingUsers))

  // Show success message
  successMessage.value = 'Password has been reset successfully!'

  // Emit success event
  setTimeout(() => {
    emit('password-reset-success')
  }, 1500)

  isLoading.value = false
}

// Handle back to login
const handleBackToLogin = () => {
  emit('back-to-login')
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
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="forgot-password-title">Reset Password</h2>
      <p class="forgot-password-subtitle">Enter your email and new password</p>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="forgot-password-form" v-else>
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

        <!-- New Password Field -->
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="formData.newPassword"
            placeholder="Enter new password"
            :class="{ 'input-error': errors.newPassword }"
          />
          <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            placeholder="Confirm new password"
            :class="{ 'input-error': errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="reset-btn" :disabled="isLoading">
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>

        <!-- Back to Login Link -->
        <p class="back-link">
          Remember your password? <a href="#" @click.prevent="handleBackToLogin">Login here</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: var(--gradient-bg);
  transition: background 0.3s ease;
}

.dark .forgot-password-container {
  background: var(--gradient-bg);
}

.forgot-password-card {
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

.dark .forgot-password-card {
  background: var(--glass-bg-strong);
}

.forgot-password-title {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.forgot-password-subtitle {
  color: var(--grey);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.success-message {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.reset-btn {
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

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(234, 64, 164, 0.4);
}

.reset-btn:active {
  transform: translateY(0);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--grey);
  font-size: 0.875rem;
}

.back-link a {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
