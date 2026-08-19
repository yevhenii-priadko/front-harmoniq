export const MAX_AVATAR_SIZE = 1024 * 1024;

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
