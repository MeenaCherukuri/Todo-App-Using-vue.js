<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:todos'])

const router = useRouter()

const editingId = ref(null)
const editInputRef = ref(null)

// Filter state
const searchQuery = ref('')
const filterCategory = ref('all')
const filterStatus = ref('all')
const filterPriority = ref('all')

// Priority tooltip messages
const priorityMessages = {
  high: 'Requires immediate attention',
  medium: 'Standard priority task',
  low: 'Can be done when time permits'
}

// Check if a todo is overdue
const isOverdue = (todo) => {
  if (!todo.deadline || todo.done) return false
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(todo.deadline)
  deadlineDate.setHours(0, 0, 0, 0)
  return deadlineDate < now
}

// Get days overdue
const getDaysOverdue = (todo) => {
  if (!todo.deadline || todo.done) return 0
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(todo.deadline)
  deadlineDate.setHours(0, 0, 0, 0)
  const diffTime = now - deadlineDate
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const sortByDeadline = (a, b) => {
  if (a.deadline && b.deadline) {
    return new Date(a.deadline) - new Date(b.deadline)
  }
  if (a.deadline && !b.deadline) {
    return -1
  }
  if (!a.deadline && b.deadline) {
    return 1
  }
  return a.createdAt - b.createdAt
}

const filteredTodos = computed(() => {
  return [...props.todos]
    .filter(todo => {
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        if (!todo.content.toLowerCase().includes(query)) {
          return false
        }
      }
      if (filterCategory.value !== 'all' && todo.category !== filterCategory.value) {
        return false
      }
      if (filterStatus.value === 'done' && !todo.done) {
        return false
      }
      if (filterStatus.value === 'notdone' && todo.done) {
        return false
      }
      if (filterPriority.value !== 'all' && todo.priority !== filterPriority.value) {
        return false
      }
      return true
    })
    .sort(sortByDeadline)
})

const professionalTodos = computed(() => {
  return filteredTodos.value.filter(todo => todo.category === 'professional')
})

const personalTodos = computed(() => {
  return filteredTodos.value.filter(todo => todo.category === 'personal')
})

const filteredCount = computed(() => filteredTodos.value.length)
const totalCount = computed(() => props.todos.length)

const toggleEdit = async (todo) => {
  if (editingId.value !== todo.id) {
    editingId.value = todo.id
    await nextTick()
    if (editInputRef.value) {
      const inputEl = Array.isArray(editInputRef.value) 
        ? editInputRef.value[0] 
        : editInputRef.value
      if (inputEl) {
        inputEl.focus()
      }
    }
  } else {
    if (editInputRef.value) {
      const inputEl = Array.isArray(editInputRef.value) 
        ? editInputRef.value[0] 
        : editInputRef.value
      if (inputEl) {
        inputEl.blur()
      }
    }
    editingId.value = null
  }
}

const handleKeydown = (event, todo) => {
  if (event.key === 'Enter') {
    toggleEdit(todo)
  } else if (event.key === 'Escape') {
    editingId.value = null
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  filterCategory.value = 'all'
  filterStatus.value = 'all'
  filterPriority.value = 'all'
}

const removeTodo = (todo) => {
  const newTodos = props.todos.filter((t) => t !== todo)
  emit('update:todos', newTodos)
}

const goToAddTask = () => {
  router.push('/add-task')
}
</script>

<template>
  <div class="tasks-view">
    <!-- Search and Filter Section -->
    <section class="search-filter">
      <h3>SEARCH & FILTER</h3>
      <div class="filter-controls">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search tasks..."
          v-model="searchQuery" />
        
        <select v-model="filterCategory" class="filter-select">
          <option value="all">All Categories</option>
          <option value="professional">Professional</option>
          <option value="personal">Personal</option>
        </select>

        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="done">Done</option>
          <option value="notdone">Not Done</option>
        </select>

        <select v-model="filterPriority" class="filter-select">
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button class="clear-filters" @click="clearFilters">Clear Filters</button>
      </div>
      <div class="filter-count" v-if="searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'">
        Showing {{ filteredCount }} of {{ totalCount }} tasks
      </div>
    </section>

    <!-- Quick Add Button -->
    <div class="quick-actions">
      <button class="add-task-btn" @click="goToAddTask">
        + Add New Task
      </button>
    </div>

    <!-- Professional Tasks Section -->
    <section class="todo-list" v-if="professionalTodos.length > 0 || filterCategory === 'all' || filterCategory === 'professional'">
      <h3>PROFESSIONAL TASKS</h3>
      <TransitionGroup name="todo" tag="div" class="todo-list-transition-group list" id="professional-todo-list">

        <div v-for="todo in professionalTodos" :key="todo.id" :class="`todo-item ${todo.done && 'done'}`">
          <label>
            <input type="checkbox" v-model="todo.done" />
            <span class="bubble professional"></span>
          </label>

          <div class="todo-content">
            <input 
              v-if="editingId === todo.id"
              ref="editInputRef"
              type="text" 
              v-model="todo.content" 
              @keydown="handleKeydown($event, todo)"
            />
            <div v-else>
              <span class="todo-text">{{ todo.content }}</span>
              <div class="todo-meta">
                <span v-if="todo.deadline" :class="['todo-deadline', { 'overdue': isOverdue(todo) }]" v-tooltip="isOverdue(todo) ? `${getDaysOverdue(todo)} day(s) overdue` : ''">
                  Deadline: {{ todo.deadline }}
                  <span v-if="isOverdue(todo)" class="overdue-indicator" v-tooltip.danger="`${getDaysOverdue(todo)} day(s) overdue!`">⚠️</span>
                </span>
                <span 
                  v-tooltip="priorityMessages[todo.priority]"
                  :class="`todo-priority priority-${todo.priority}`">
                  {{ todo.priority }} priority
                </span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button 
              class="edit" 
              :class="{ 'save': editingId === todo.id }" 
              @click="toggleEdit(todo)">
              {{ editingId === todo.id ? 'Save' : 'Edit' }}
            </button>
            <button class="delete" @click="removeTodo(todo)">Delete</button>
          </div>
        </div>

        <div v-if="professionalTodos.length === 0" class="empty-state">
          No professional tasks yet. Add one to get started!
        </div>

      </TransitionGroup>
    </section>

    <!-- Personal Tasks Section -->
    <section class="todo-list" v-if="personalTodos.length > 0 || filterCategory === 'all' || filterCategory === 'personal'">
      <h3>PERSONAL TASKS</h3>
      <TransitionGroup name="todo" tag="div" class="todo-list-transition-group list" id="personal-todo-list">

        <div v-for="todo in personalTodos" :key="todo.id" :class="`todo-item ${todo.done && 'done'}`">
          <label>
            <input type="checkbox" v-model="todo.done" />
            <span class="bubble personal"></span>
          </label>

          <div class="todo-content">
            <input 
              v-if="editingId === todo.id"
              ref="editInputRef"
              type="text" 
              v-model="todo.content" 
              @keydown="handleKeydown($event, todo)"
            />
            <div v-else>
              <span class="todo-text">{{ todo.content }}</span>
              <div class="todo-meta">
                <span v-if="todo.deadline" :class="['todo-deadline', { 'overdue': isOverdue(todo) }]" v-tooltip="isOverdue(todo) ? `${getDaysOverdue(todo)} day(s) overdue` : ''">
                  Deadline: {{ todo.deadline }}
                  <span v-if="isOverdue(todo)" class="overdue-indicator" v-tooltip.danger="`${getDaysOverdue(todo)} day(s) overdue!`">⚠️</span>
                </span>
                <span 
                  v-tooltip="priorityMessages[todo.priority]"
                  :class="`todo-priority priority-${todo.priority}`">
                  {{ todo.priority }} priority
                </span>
              </div>
            </div>
          </div>

          <div class="actions">
            <button 
              class="edit" 
              :class="{ 'save': editingId === todo.id }" 
              @click="toggleEdit(todo)">
              {{ editingId === todo.id ? 'Save' : 'Edit' }}
            </button>
            <button class="delete" @click="removeTodo(todo)">Delete</button>
          </div>
        </div>

        <div v-if="personalTodos.length === 0" class="empty-state">
          No personal tasks yet. Add one to get started!
        </div>

      </TransitionGroup>
    </section>
  </div>
</template>

<style scoped>
.tasks-view {
  width: 100%;
}

.quick-actions {
  margin: 1.5rem 0;
}

.add-task-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary) 0%, #c724b1 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-smooth);
}

.add-task-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(234, 64, 164, 0.45);
}

/* Search and Filter Section - Glassmorphism */
.search-filter {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
}

.search-filter h3 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--grey);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1 1 200px;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  color: var(--dark);
  background-color: var(--light);
  border-radius: 0.5rem;
  min-width: 150px;
  transition: background-color 0.3s ease;
}

.search-input:focus {
  outline: 2px solid var(--primary);
}

.filter-select {
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  color: var(--dark);
  background-color: var(--light);
  border-radius: 0.5rem;
  cursor: pointer;
  min-width: 120px;
  transition: background-color 0.3s ease;
}

.filter-select:focus {
  outline: 2px solid var(--primary);
}

.clear-filters {
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  color: #FFF;
  background-color: var(--grey);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-base);
}

.clear-filters:hover {
  background-color: var(--dark);
  transform: scale(1.02);
  box-shadow: var(--shadow-hover);
}

.filter-count {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--grey);
}

/* Todo List Styles - Glassmorphism */
.todo-list {
  margin-top: 1.5rem;
}

.todo-list h3 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--grey);
}

.todo-list .list {
  margin: 1rem 0;
} 

.todo-list .todo-item {
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
  margin-bottom: 1rem;
  transition: all var(--transition-smooth);
}

.todo-list .todo-item:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-card-hover);
  background: var(--glass-bg-strong);
}

.todo-item label {
  display: block;
  margin-right: 1rem;
  cursor: pointer;
}

.todo-item .todo-content {
  flex: 1 1 0%;
  cursor: pointer;
}

.todo-item .todo-content input {
  color: var(--dark);
  font-size: 1.125rem;
  width: 100%;
}

.todo-item .todo-text {
  color: var(--dark);
  font-size: 1.125rem;
  display: block;
  width: 100%;
}

.todo-item .todo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.todo-item .todo-deadline {
  display: block;
  font-size: 0.875rem;
  color: var(--grey);
}

.todo-item .todo-deadline.overdue {
  color: #EF4444;
  font-weight: 600;
}

.todo-item .overdue-indicator {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  cursor: help;
}

.todo-item .todo-priority {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
}

.todo-item .todo-priority.priority-high {
  color: var(--priority-high);
  background-color: rgba(255, 91, 87, 0.1);
}

.todo-item .todo-priority.priority-medium {
  color: var(--priority-medium);
  background-color: rgba(255, 191, 0, 0.1);
}

.todo-item .todo-priority.priority-low {
  color: var(--priority-low);
  background-color: rgba(58, 130, 238, 0.1);
}

.todo-item .actions {
  display: flex;
  align-items: center;
}

.todo-item .actions button {
  display: block;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: #FFF;
  cursor: pointer;
  transition: all var(--transition-base);
}

.todo-item .actions button:hover {
  opacity: 0.85;
  transform: scale(1.05);
  box-shadow: var(--glow-subtle);
}

.todo-item .actions .edit {
  margin-right: 0.5rem;
  background-color: var(--primary);
}

.todo-item .actions .edit.save {
  background-color: #4CAF50;
}

.todo-item .actions .delete {
  background-color: var(--danger);
}

.todo-item.done .todo-content input {
  text-decoration: line-through;
  color: var(--grey);
}

.todo-item.done .todo-text {
  text-decoration: line-through;
  color: var(--grey);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--grey);
  font-size: 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  box-shadow: var(--glass-shadow);
  border: 1px solid var(--glass-border);
}
</style>
