"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import Button from "@/components/Button/Button";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import FormField from "@/components/FormField/FormField";
import { updateUserProfile } from "@/lib/api/clientApi";
import {
  getAvatarSrc,
  hasProfileChanges,
  validateAvatar,
  validateUsername,
} from "@/lib/profile/userProfile";
import { AuthUser, useAuthStore } from "@/lib/store/authStore";
import css from "./UserModal.module.css";

type UserModalProps = {
  user: AuthUser;
  onClose: () => void;
};

export default function UserModal({ user, onClose }: UserModalProps) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const currentAvatar = getAvatarSrc(user.avatar) ?? "";
  const [username, setUsername] = useState(user.username);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const [usernameError, setUsernameError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges = hasProfileChanges(user.username, username, avatarFile);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isSubmitting, onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextUsername = event.target.value;
    setUsername(nextUsername);

    if (usernameError) {
      setUsernameError(validateUsername(nextUsername));
    }
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    const error = validateAvatar(file);

    setAvatarError(error);
    setSubmitError("");

    if (error) {
      setAvatarFile(null);
      setPreviewUrl(currentAvatar);
      event.target.value = "";
      return;
    }

    setAvatarFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextUsernameError = validateUsername(username);
    const nextAvatarError = validateAvatar(avatarFile);
    setUsernameError(nextUsernameError);
    setAvatarError(nextAvatarError);

    if (nextUsernameError || nextAvatarError || !hasChanges) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserProfile({
        currentUsername: user.username,
        username,
        avatar: avatarFile,
      });

      setUser(updatedUser);
      onClose();
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to update your profile.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ErrorNotification
        message={submitError}
        onClose={() => setSubmitError("")}
      />

      <div
        className={css.backdrop}
        role="presentation"
        onMouseDown={handleBackdropClick}
      >
        <div
          className={css.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-modal-title"
        >
          <button
            className={css.closeButton}
            type="button"
            aria-label="Close profile settings"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <svg className={css.closeIcon} aria-hidden="true">
              <use href="/sprite.svg#icon-close-small" />
            </svg>
          </button>

          <h2 className={css.title} id="user-modal-title">
            Edit profile
          </h2>

          <form className={css.form} onSubmit={handleSubmit} noValidate>
            <div className={css.avatarField}>
              <input
                className={css.fileInput}
                id="profile-avatar"
                name="avatar"
                type="file"
                accept="image/*"
                disabled={isSubmitting}
                onChange={handleAvatarChange}
              />

              <label className={css.avatarPicker} htmlFor="profile-avatar">
                {previewUrl ? (
                  <Image
                    className={css.avatarPreview}
                    src={previewUrl}
                    alt="Profile avatar preview"
                    width={120}
                    height={120}
                  />
                ) : (
                  <svg className={css.avatarFallback} aria-hidden="true">
                    <use href="/sprite.svg#icon-user" />
                  </svg>
                )}

                <span className={css.cameraBadge} aria-hidden="true">
                  <svg className={css.cameraIcon}>
                    <use href="/sprite.svg#icon-camera" />
                  </svg>
                </span>
                <span className={css.visuallyHidden}>Choose a new avatar</span>
              </label>

              <p className={css.fieldError} aria-live="polite">
                {avatarError}
              </p>
            </div>

            <FormField
              id="profile-username"
              name="username"
              label="Name"
              type="text"
              value={username}
              autoComplete="name"
              autoFocus
              maxLength={64}
              error={usernameError}
              onChange={handleUsernameChange}
              onBlur={() => setUsernameError(validateUsername(username))}
            />

            <Button
              className={css.saveButton}
              type="submit"
              fullWidth
              disabled={!hasChanges}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
