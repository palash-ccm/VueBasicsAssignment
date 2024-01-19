<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getData,
  deleteData,
  postData,
  toggleIsComplete,
} from "./APICalls.vue";

type Task = {
  createdAt: string;
  isComplete?: boolean;
  todoName: string;
  updatedAt: string;
  _v: number;
  _id: string;
  isEditing? : boolean
};

// type PostTask = Omit<Task, "createdAt" | "updatedAt" | "_v" | "_id">;

const tasks = ref<Task[]>([]);
const selectedTasks = ref<Task[]>([]);
const todoTask = ref("");
const checkedFilters = ref([]);
// const postTask = ref<PostTask>({ isComplete: false, todoName: "" });
const sortType = ref(0);
const isEditable = ref(false)

const filterTasks = () => {
  if (JSON.stringify(checkedFilters.value) === JSON.stringify(["pending"])) {
    selectedTasks.value = tasks.value.filter(
      (task) => task.isComplete === false
    );
  } else if (
    JSON.stringify(checkedFilters.value) === JSON.stringify(["completed"])
  ) {
    selectedTasks.value = tasks.value.filter(
      (task) => task.isComplete === true
    );
  } else {
    selectedTasks.value = tasks.value;
  }
  console.log("on Filter", selectedTasks.value);
};

const sortList = () => {
  if (sortType.value === 0) {
    tasks.value.sort((a, b) => {
      return a.todoName > b.todoName ? 1 : -1;
    });
    sortType.value = 1;
  } else {
    tasks.value.sort((a, b) => {
      return a.todoName < b.todoName ? 1 : -1;
    });
    sortType.value = 0;
  }
};

const editName = (event, id) => {
    const editableTask = selectedTasks.value.find((task)=> task._id === id)
    if(editableTask){
      editableTask.todoName = event.target.innerText
      editableTask.isEditing = false
    }
}

const updateList = async (fn, id?) => {
  switch (fn) {
    case -1:
      await deleteData(id);
      break;
    case 0:
      await toggleIsComplete(id);
      break;
    case 1:
      await postData({
        todoName: todoTask.value,
        isComplete: false,
      });
  }
  todoTask.value=''
  tasks.value = await getData();
  filterTasks();
};
onMounted(async () => {
  tasks.value = await getData();
  selectedTasks.value = tasks.value;
});
</script>

<template>
  <h1>Vue Test</h1>
  <div id="filter">
    <input
      type="checkbox"
      id="completed"
      value="completed"
      v-model="checkedFilters"
      @change="filterTasks"
    />
    <label for="completed">completed</label>

    <input
      type="checkbox"
      id="pending"
      value="pending"
      v-model="checkedFilters"
      @change="filterTasks"
    />
    <label for="pending">pending</label>
  </div>
  <div id="tableContainer">
    <tbody id="taskTable">
      <tr>
        <th id="title" @click="sortList">Title</th>
        <th>Complete</th>
        <th>Actions</th>
      </tr>
      <tr v-for="task in selectedTasks">
        <td :contenteditable= "task.isEditing"
        @blur="editName($event, task._id)">{{ task.todoName }}</td>
        <td @click="updateList(0, task._id)">
            {{ task.isComplete? "completed" : "pending" }}
        </td>
        <td><button @click="task.isEditing=true">Edit</button><button @click="updateList(-1, task._id)">Delete</button></td>
      </tr>
    </tbody>
  </div>
  <div>
    <form @submit.prevent="updateList(1)">
      <label for="task">Task Name: </label>
      <input type="text" id="task" v-model="todoTask" />
      <button type="submit">Add Task</button>
    </form>
  </div>
</template>

<style scoped>
#tableContainer{
  display: inline-block
}
#taskTable{
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#taskTable td, #taskTable th{
  border: 1px solid black;
  padding: 8px;
}

#taskTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #0735cd;
  color: white;
}
#title:hover{
  background-color: #042aa5;
}
</style>
