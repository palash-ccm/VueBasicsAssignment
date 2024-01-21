import axios from "axios";
const API_LINK = "https://calm-plum-jaguar-tutu.cyclic.app/todos";

type Task = {
  createdAt: string;
  isComplete?: boolean;
  todoName: string;
  updatedAt: string;
  _v: number;
  _id: string;
};

type postTask = {
  todoName: string;
  isComplete: boolean;
};

export const getData = async (id?: string) => {
  if (id) {
    try {
      const response = await axios.get(`${API_LINK}/${id}`);
      const data = response.data.data;
      return data;
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log("Some Error Occured");
      }
    }
  } else {
    try {
      const response = await axios.get(API_LINK);
      const data = response.data.data;
      return data.sort((a: Task, b: Task) => {
        return a.createdAt.toUpperCase() < b.createdAt.toUpperCase() ? 1 : -1;
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      } else {
        console.log("Some Error Occured");
      }
    }
  }
};

export const postData = async (postTask: postTask) => {
  try {
    await axios.post(API_LINK, postTask);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("Some Error Occured");
    }
  }
};

export const toggleIsComplete = async (id: string, currStatus: boolean) => {
  try {
    if (currStatus === false) {
      await axios.put(`${API_LINK}/${id}`, {
        isComplete: true,
      });
    } else {
      await axios.put(`${API_LINK}/${id}`, {
        isComplete: false,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("Some Error Occured");
    }
  }
};

export const deleteData = async (id: string) => {
  try {
    await axios.delete(`${API_LINK}/${id}`);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("Some Error Occured");
    }
  }
};
