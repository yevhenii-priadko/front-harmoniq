"use client";

import Image from "next/image";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import { uploadAvatar } from "@/lib/api/clientApi";
import styles from "./UploadForm.module.css";

const MAX_FILE_SIZE = 1024 * 1024;

export default function UploadForm() {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(""); // для превью вибраного фото
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    // Перевіряємо, чи вибраний файл — зображення (image/*)
    if (!file.type.startsWith("image/")) {
      setImageFile(null);
      setPreviewUrl("");
      setError("Only images are allowed.");
      return;
    }

    // перевірка розміру файлу (не більше 1 МБ)
    if (file.size > MAX_FILE_SIZE) {
      setImageFile(null);
      setPreviewUrl("");
      setError("Maximum file size is 1 MB.");
      return;
    }

    setImageFile(file);

    // Створюємо URL для превью вибраного фото
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // Закриваємо форму завантаження фото і повертаємося на сторінку профілю
  const handleClose = () => {
    router.replace("/profile");
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageFile) {
      setError("Please choose a photo before saving.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Викликаємо функцію завантаження фото на сервер
      await uploadAvatar(imageFile);

      router.replace("/profile");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to upload your photo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ErrorNotification message={error} onClose={() => setError("")} />

      <form className={styles.form} onSubmit={handleSubmit}>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Skip photo upload"
          onClick={handleClose}
        >
          <svg className={styles.closeIcon} aria-hidden="true">
            <use href="/sprite.svg#icon-close" />
          </svg>
        </button>

        <h1 className={styles.title}>Upload your photo</h1>

        <input
          className={styles.fileInput}
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label className={styles.photoPicker} htmlFor="avatar">
          {previewUrl ? (
            <Image
              className={styles.preview}
              src={previewUrl}
              alt="Selected profile photo"
              width={136}
              height={136}
            />
          ) : (
            <svg className={styles.cameraIcon} aria-hidden="true">
              <use href="/sprite.svg#icon-camera" />
            </svg>
          )}

          <span className={styles.visuallyHidden}>Choose a profile photo</span>
        </label>

        <Button
          className={styles.saveButton}
          type="submit"
          fullWidth
          disabled={!imageFile}
          isLoading={isSubmitting}
          loadingText="Saving..."
        >
          Save
        </Button>
      </form>
    </>
  );
}
