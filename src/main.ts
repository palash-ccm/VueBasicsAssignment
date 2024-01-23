import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import TaskList from './components/TaskList.vue'
import AddTasks from './components/AddTasks.vue'
import TaskDetails from './components/TaskDetails.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSort, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {createWebHistory, createRouter} from 'vue-router'


library.add(faSort)
library.add(faSpinner)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: TaskList},
        {path: '/addTask', component: AddTasks},
        {path: '/taskDetails/:id', component: TaskDetails},
    ]
})



const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
