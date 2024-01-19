<script>
import axios from "axios";
const API_LINK = "https://calm-plum-jaguar-tutu.cyclic.app/todos";

export const getData = async () => {
  console.log("Called getData");
  try {
    const response = await axios.get(API_LINK);
    const data = response.data.data;
    return data;
  } catch (e) {
    console.error(e);
  }
};

export const postData = async (postTask) => {
  //   postTask.value.todoName = todoTask.value;
  //   postTask.value.isComplete = false;
  //   console.log({ postTask });
  await axios.post(API_LINK, postTask);
  // console.log({response})
};

export const toggleIsComplete = async (id, currStatus) => {
  if (currStatus === false) {
    await axios.put(`${API_LINK}/${id}`, {
      isComplete: true,
    });
  }else{
    await axios.put(`${API_LINK}/${id}`, {
      isComplete: false,
    });
  }
};

export const deleteData = async (id) => {
  //   console.log("deleting now...")
  await axios.delete(`${API_LINK}/${id}`);
  console.log("deleted");
  //   getData();
};
</script>
