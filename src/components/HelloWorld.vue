<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  getData,
  deleteData,
  postData,
  toggleIsComplete,
} from "./APICalls.vue";
import BaseCard from "../components/UI/BaseCard.vue";

components: [BaseCard];

type Task = {
  createdAt: string;
  isComplete?: boolean;
  todoName: string;
  updatedAt: string;
  _v: number;
  _id: string;
  isEditing?: boolean;
};

// const fnList = ['delete', 'post', 'put']
type fnToCall = "delete" | "post" | "put";

// type PostTask = Omit<Task, "createdAt" | "updatedAt" | "_v" | "_id">;

const tasks = ref<Task[]>([]);
const selectedTasks = ref<Task[]>([]);
const todoTask = ref("");
const checkedFilters = ref([]);
// const postTask = ref<PostTask>({ isComplete: false, todoName: "" });
const sortType = ref(0);
// const isEditable = ref(false);

const filterTasks = (): void => {
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

const sortList = (): void => {
  if (sortType.value === 0) {
    tasks.value.sort((a, b) => {
      return a.todoName.toUpperCase() > b.todoName.toUpperCase() ? 1 : -1;
    });
    sortType.value = 1;
  } else {
    tasks.value.sort((a, b) => {
      return a.todoName.toUpperCase() < b.todoName.toUpperCase() ? 1 : -1;
    });
    sortType.value = 0;
  }
};

// const editClickHandler = (id) {

// }

const editName = (event, id: string) => {
  const editableTask = selectedTasks.value.find((task) => task._id === id);
  if (editableTask) {
    editableTask.todoName = event.target.innerText;
    editableTask.isEditing = false;
  }
};

const updateList = async (
  fn: fnToCall,
  id?: string,
  currStatus?: boolean
): Promise<void> => {
  switch (fn) {
    case "delete":
      await deleteData(id);
      break;
    case "put":
      await toggleIsComplete(id, currStatus);
      break;
    case "post":
      await postData({
        todoName: todoTask.value,
        isComplete: false,
      });
  }
  todoTask.value = "";
  tasks.value = await getData();
  filterTasks();
};
onMounted(async () => {
  tasks.value = await getData();
  selectedTasks.value = tasks.value;
});
</script>

<template>
  <h1>Todo App</h1>
  <section id="main">
    <base-card style="height: 35px">
      <div id="filter">
        <div>
          <input
            type="checkbox"
            id="completed"
            value="completed"
            v-model="checkedFilters"
            @change="filterTasks"
          />
          <label for="completed">completed</label>
        </div>

        <div>
          <input
            type="checkbox"
            id="pending"
            value="pending"
            v-model="checkedFilters"
            @change="filterTasks"
          />
          <label for="pending">pending</label>
        </div>
      </div>
    </base-card>
    <base-card>
      <div id="tableContainer">
        <tbody id="taskTable">
          <tr>
            <th id="title" @click="sortList">Title&nbsp;<font-awesome-icon icon="fa-solid fa-sort" /></th>
            <th>Complete</th>
            <th>Actions</th>
          </tr>
          <tr v-for="task in selectedTasks">
            <td
              :contenteditable="task.isEditing"
              @blur="editName($event, task._id)"
            >
              {{ task.todoName }}
            </td>
            <td
              @click="updateList('put', task._id, task.isComplete)"
              id="status"
            >
              {{ task.isComplete ? "completed" : "pending" }}
            </td>
            <td>
              <button @click="task.isEditing = true" id="actions">Edit</button
              ><button @click="updateList('delete', task._id)" id="actions">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </div>
      <div>
        <form @submit.prevent="updateList('post')">
          <label for="task">Task Name: </label>
          <input type="text" id="task" v-model="todoTask" />
          <button type="submit" id="submit">Add Task</button>
        </form>
      </div>
    </base-card>
  </section>
</template>

<style scoped>
#tableContainer {
  display: inline-block;
}
#taskTable {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  border-radius: 15px;
}

#taskTable td,
#taskTable th {
  border: 1px solid black;
  padding: 8px;
}

#taskTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #597ef9;
  color: white;
}
#title:hover {
  background-color: #3b519b;
  cursor: pointer;
}
#status:hover {
  background-color: #f4f4f4;
  cursor: pointer;
}
#submit {
  margin: 10px;
}
#actions {
  margin: 5px;
}
#main {
  display: flex;
}
#filter {
  display: inline-block;
  justify-content: left;
}
#filter div{
  text-align: left;
}
</style>
