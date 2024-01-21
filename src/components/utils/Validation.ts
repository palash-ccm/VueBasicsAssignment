import { helpers, required } from "@vuelidate/validators";


const mustIncludeVue = (val: string) => val.toLowerCase().includes("vue");
export const rules = {
  todoName: {
    required: helpers.withMessage("This field cannot be empty", required),
    isNameValid: helpers.withMessage(
      "This field contains invalid characters",
      helpers.regex(/^[a-z0-9_ ]*$/i)
    ),
    mustIncludeVue,
  },
};
