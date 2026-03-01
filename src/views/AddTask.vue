<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:todos'])

const router = useRouter()

// Input fields
const input_content = ref('')
const input_category = ref(null)
const input_deadline = ref('')
const input_priority = ref('medium')

const addTodo = () => {
  if (input_content.value.trim() === '' || input_category.value === null) {
    return
  }

  const newTodo = {
    id: Date.now(),
    content: input_content.value,
    category: input_category.value,
    priority: input_priority.value,
    done: false,
    createdAt: new Date().getTime(),
    deadline: input_deadline.value || null
  }

  const updatedTodos = [...props.todos, newTodo]
  emit('update:todos', updatedTodos)

  // Reset form
  input_content.value = ''
  input_category.value = null
  input_deadline.value = ''
  input_priority.value = 'medium'

  // Redirect to tasks page
  router.push('/tasks')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="add-task-view">
    <div class="page-header">
      <button class="back-btn" @click="goBack">← Back</button>
      <h2>Create New Task</h2>
    </div>

    <section class="create-todo">
      <form id="new-todo-form" @submit.prevent="addTodo">
        <h4>What's on your todo list?</h4>
        <input 
          type="text" 
          name="content" 
          id="content" 
          placeholder="e.g. make a video"
          v-model="input_content" />
        
        <h4>Pick a category</h4>
        <div class="options">

          <label>
            <input 
              type="radio" 
              name="category" 
              id="category1" 
              value="professional"
              v-model="input_category" />
            <span class="bubble professional"></span>
            <div>Professional</div>
          </label>

          <label>
            <input 
              type="radio" 
              name="category" 
              id="category2" 
              value="personal"
              v-model="input_category" />
            <span class="bubble personal"></span>
            <div>Personal</div>
          </label>

        </div>

        <h4>Pick a priority</h4>
        <div class="options priority-options">
          <label>
            <input 
              type="radio" 
              name="priority" 
              id="priority1" 
              value="high"
              v-model="input_priority" />
            <span class="bubble-priority high"></span>
            <div>High</div>
          </label>

          <label>
            <input 
              type="radio" 
              name="priority" 
              id="priority2" 
              value="medium"
              v-model="input_priority" />
            <span class="bubble-priority medium"></span>
            <div>Medium</div>
          </label>

          <label>
            <input 
              type="radio" 
              name="priority" 
              id="priority3" 
              value="low"
              v-model="input_priority" />
            <span class="bubble-priority low"></span>
            <div>Low</div>
          </label>
        </div>

        <input type="date" 
          name="deadline" 
          id="deadline"
          v-model="input_deadline" />
        
        <input type="submit" value="Add todo" />
      </form>
    </section>
  </div>
</template>

<style scoped>
.add-task-view {
  width: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--dark);
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-base);
  border: 1px solid var(--glass-border);
}

.back-btn:hover {
  background: var(--glass-bg-strong);
  transform: scale(1.02);
  box-shadow: var(--shadow-hover);
}

.page-header h2 {
  color: var(--dark);
  font-size: 1.5rem;
  font-weight: 700;
}

.create-todo {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
}

.create-todo h4 {
  color: var(--grey);
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.create-todo input[type="text"] {
  display: block;
  width: 100%;
  font-size: 1.125rem;
  padding: 1rem 1.5rem;
  color: var(--dark);
  background-color: var(--light);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.create-todo input[type="text"]:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--card-bg);
}

.create-todo .options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
  margin-bottom: 1.5rem;
}

.create-todo .options.priority-options {
  grid-template-columns: repeat(3, 1fr);
}

.create-todo .options label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: all var(--transition-smooth);
}

.create-todo .options label:hover {
  transform: translateY(-3px) scale(1.03);
  background: var(--glass-bg-strong);
  box-shadow: var(--shadow-card-hover);
}

input[type="radio"],
input[type="checkbox"] {
  display: none;
}

.bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--professional);
  box-shadow: var(--professional-glow);
}

.bubble.personal {
  border-color: var(--personal);
  box-shadow: var(--personal-glow);
}

.bubble::after {
  content: "";
  display: block;
  opacity: 0;
  width: 0px;
  height: 0px;
  background-color: var(--professional);
  box-shadow: var(--professional-glow);
  border-radius: 50%;
  transition: 0.2s ease-in-out;
}

.bubble.personal::after {
  background-color: var(--personal);
  box-shadow: var(--personal-glow);
}

input:checked ~ .bubble::after {
  width: 10px;
  height: 10px;
  opacity: 1;
}

.bubble-priority {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--priorityMedium);
  box-shadow: 0px 0px 4px rgba(255, 191, 0, 0.5);
}

.bubble-priority.high {
  border-color: var(--priority-high);
  box-shadow: 0px 0px 4px rgba(255, 91, 87, 0.5);
}

.bubble-priority.medium {
  border-color: var(--priority-medium);
  box-shadow: 0px 0px 4px rgba(255, 191, 0, 0.5);
}

.bubble-priority.low {
  border-color: var(--priority-low);
  box-shadow: 0px 0px 4px rgba(58, 130, 238, 0.5);
}

.bubble-priority::after {
  content: "";
  display: block;
  opacity: 0;
  width: 0px;
  height: 0px;
  background-color: var(--priority-medium);
  border-radius: 50%;
  transition: 0.2s ease-in-out;
}

.bubble-priority.high::after {
  background-color: var(--priority-high);
}

.bubble-priority.medium::after {
  background-color: var(--priority-medium);
}

.bubble-priority.low::after {
  background-color: var(--priority-low);
}

input:checked ~ .bubble-priority::after {
  width: 10px;
  height: 10px;
  opacity: 1;
}

.create-todo .options label div {
  color: var(--dark);
  font-size: 1.125rem;
  margin-top: 1rem;
  font-weight: 500;
}

.create-todo input[type="date"] {
  display: block;
  width: 100%;
  font-size: 1.125rem;
  padding: 1rem 1.5rem;
  color: var(--dark);
  background-color: var(--light);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
  transition: background-color 0.3s ease;
}

.create-todo input[type="date"]:focus {
  outline: 2px solid var(--primary);
}

.create-todo input[type="submit"] {
  display: block;
  width: 100%;
  font-size: 1.125rem;
  padding: 1rem 1.5rem;
  color: #FFF;
  background-color: var(--primary);
  border-radius: 0.5rem;
  box-shadow: var(--personal-glow);
  cursor: pointer;
  transition: all var(--transition-smooth);
  font-weight: 600;
}

.create-todo input[type="submit"]:hover {
  opacity: 0.9;
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--glow-hover);
}
</style>
