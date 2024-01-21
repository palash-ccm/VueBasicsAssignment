<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { postData } from "./utils/ApiCalls.ts";
import {rules} from './utils/Validation.ts'

const todoName = ref("");
const router = useRouter();
const isLoading = ref(false)

const $v = useVuelidate(rules, { todoName })

const storeTask = async () => {
  if (!$v.value.$invalid) {
    isLoading.value = true
   await postData({ todoName: todoName.value, isComplete: false });
   isLoading.value = false
    todoName.value = "";
    router.push("/");
  } else {
    alert("form has invalid value");
  }
};
</script>

<template>
  <div>
    <router-link to="/">See all Tasks</router-link>
    <div v-if="isLoading" id="loader">
    <dialog open>
      <div>
        <h3>Loading...</h3>
        <font-awesome-icon icon="fa-solid fa-spinner" />
      </div>
    </dialog>
  </div>
    <form @submit.prevent="storeTask">
      <label for="task">Task name: </label>
      <input type="text" id="task" @blur="$v.todoName.$touch" v-model="todoName" />
      <p v-if="$v.todoName.$error" style="color: red">
        Please enter a valid value
      </p>
      <button type="submit">Store Task</button>
    </form>
  </div>
</template>