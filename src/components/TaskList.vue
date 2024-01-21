<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getData, deleteData, toggleIsComplete } from "./utils/ApiCalls.ts";

type Task = {
  createdAt: string;
  isComplete?: boolean;
  todoName: string;
  updatedAt: string;
  _v: number;
  _id: string;
};

type fnToCall = "DELETE" | "PUT";

const tasks = ref<Task[]>([]);
const selectedTasks = ref<Task[]>([]);
const checkedFilters = ref([]);
const sortType = ref(0);
const searchParams = ref("");
const isLoading = ref(false);
const router = useRouter();

const computedTasks = computed(() => {
  return selectedTasks.value.filter((task) =>
    task.todoName.includes(searchParams.value)
  );
});

const showSearchResults = () => {
  selectedTasks.value = computedTasks.value;
};

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

const updateList = async (
  fn: fnToCall,
  id?: string,
  currStatus?: boolean
): Promise<void> => {
  switch (fn) {
    case "DELETE":
      if (id) {
        isLoading.value = true;
        await deleteData(id);
      }
      isLoading.value = false;
      break;
    case "PUT":
      if (id && currStatus === false) {
        isLoading.value = true;
        await toggleIsComplete(id, currStatus);
      }

      isLoading.value = false;
      break;
  }
  tasks.value = await getData();
  filterTasks();
};

const redirectToTaskDetails = (id: string) => {
  router.push({ path: `/taskDetails/${id}`, query: { id } });
};

onMounted(async () => {
  isLoading.value = true;
  tasks.value = await getData();
  isLoading.value = false;
  selectedTasks.value = tasks.value;
});
</script>

<template>
  <h1>Todo App</h1>
  <div v-if="isLoading" id="loader">
    <dialog open>
      <div>
        <h3>Loading...</h3>
        <font-awesome-icon icon="fa-solid fa-spinner" />
      </div>
    </dialog>
  </div>
  <section id="main">
    <div id="filter">
      <section>
        <input type="text" id="search" v-model="searchParams" />
        <label for="search"></label>
        <button @click="showSearchResults">search</button>
      </section>
      <section id="check-box">
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
      </section>

      <section>
        <router-link to="/addTask"><button>Add Task</button></router-link>
      </section>
    </div>

    <section id="card">
      <!-- <div id="tableContainer"> -->
      <!-- <tbody id="taskTable"> -->
      <tr>
        <th id="title" @click="sortList">
          Title&nbsp;<font-awesome-icon icon="fa-solid fa-sort" />
        </th>
        <th>Complete</th>
        <th>Actions</th>
      </tr>
      <tr v-for="task in selectedTasks">
        <td id="task-name">
          {{ task.todoName }}
        </td>
        <td @click="updateList('PUT', task._id, task.isComplete)" id="status">
          {{ task.isComplete ? "completed" : "pending" }}
        </td>
        <td>
          <button @click="redirectToTaskDetails(task._id)" id="actions">
            Edit</button
          ><button @click="updateList('DELETE', task._id)" id="actions">
            Delete
          </button>
        </td>
      </tr>
      <!-- </tbody> -->
      <!-- </div> -->
    </section>
  </section>
</template>

<style scoped></style>
