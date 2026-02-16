import api from "./axios";

export const uploadFiles = (formData) =>
  api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
