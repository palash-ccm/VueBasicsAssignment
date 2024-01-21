<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { getData, deleteData, postData } from "./utils/ApiCalls.ts";
import { rules } from "./utils/Validation.ts";

type Task = {
  createdAt: string;
  isComplete?: boolean;
  todoName: string;
  updatedAt: string;
  _v: number;
  _id: string;
};

const taskDetail = ref<Task>({
  createdAt: "",
  isComplete: false,
  todoName: "",
  updatedAt: "",
  _v: 0,
  _id: "",
});
const isEditing = ref(false);
const isLoading = ref(false)
const route = useRoute();
const router = useRouter();

const updateTask = async () => {
  const postTodo = document.getElementById("editable-task")!.innerText;
  const postStatus = taskDetail.value.isComplete;

  const $v = useVuelidate(rules, { todoName: postTodo });

  if (!$v.value.$invalid) {
    isLoading.value =true
    await deleteData(taskDetail.value._id);
    if (postStatus === false || postStatus)
      await postData({ todoName: postTodo, isComplete: postStatus });
    isLoading.value = false
    router.replace("/");
  } else {
    alert("Please enter a valid task name");
  }
};

const makeEditable = () => {
  setTimeout(() =>{document.getElementById("editable-task")!.focus();}, 20)
  
  isEditing.value = !isEditing.value;
  
};

onMounted(async () => {
  if (route.query.id) taskDetail.value = await getData(route.query.id);
});
</script>

<template>
  <router-link to="/">See all Tasks</router-link>
  <div v-if="isLoading" id="loader">
    <dialog open>
      <div>
        <h3>Loading...</h3>
        <font-awesome-icon icon="fa-solid fa-spinner" />
      </div>
    </dialog>
  </div>
  <div>
    <h1>Task Details</h1>
    <h3 :contenteditable="isEditing" id="editable-task">
      {{ taskDetail.todoName }}
    </h3>
    <button v-if="isEditing" @click="updateTask">Update Task</button>
    <h4>
      {{
        taskDetail.isComplete ? "Task has been completed" : "Task is incomplete"
      }}
    </h4>
  </div>
  <button @click="makeEditable">Edit task title</button>
</template>