export const MAX_AVATAR_SIZE = 1024 * 1024;

// Домени, з якими next/image дозволено працювати (див. next.config.ts -> images.remotePatterns).
export const ALLOWED_AVATAR_HOSTS = ['res.cloudinary.com', 'ftp.goit.study'];

// Бекенд іноді підставляє невалідний плейсхолдер "https:URL" замість реального
// аватара (наприклад, коли юзер реєструється без фото). new URL("https:URL")
// при цьому парситься як https://url/ (валідний URL з хостом "url"), тому
// проста перевірка на protocol === 'https:' це пропускає — і next/image падає
// з рантайм-помилкою, бо хост "url" не в білому списку. Єдина спільна функція
// для всіх місць, де рендериться аватар користувача/автора.
export const getAvatarSrc = (avatar) => {
  const trimmedAvatar = avatar?.trim();

  if (!trimmedAvatar || trimmedAvatar === 'https:URL') {
    return null;
  }

  if (trimmedAvatar.startsWith('/')) {
    return trimmedAvatar;
  }

  try {
    const url = new URL(trimmedAvatar);
    return ALLOWED_AVATAR_HOSTS.includes(url.hostname) ? trimmedAvatar : null;
  } catch {
    return null;
  }
};

export const validateUsername = (username) => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    return 'Name is required.';
  }

  if (trimmedUsername.length < 2) {
    return 'Name must be at least 2 characters.';
  }

  if (trimmedUsername.length > 32) {
    return 'Name must be at most 32 characters.';
  }

  return '';
};

export const validateAvatar = (file) => {
  if (!file) {
    return '';
  }

  if (!file.type.startsWith('image/')) {
    return 'Only images are allowed.';
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return 'Maximum file size is 1 MB.';
  }

  return '';
};

export const hasProfileChanges = (currentUsername, username, avatar) =>
  currentUsername.trim() !== username.trim() || Boolean(avatar);

export const buildProfileFormData = (currentUsername, username, avatar) => {
  const formData = new FormData();
  const trimmedUsername = username.trim();

  if (currentUsername.trim() !== trimmedUsername) {
    formData.append('username', trimmedUsername);
  }

  if (avatar) {
    formData.append('avatar', avatar);
  }

  return formData;
};
