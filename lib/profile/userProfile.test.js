import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_AVATAR_SIZE,
  buildProfileFormData,
  hasProfileChanges,
  validateAvatar,
  validateUsername,
} from './userProfile.js';

test('validates trimmed usernames from 2 through 32 characters', () => {
  assert.equal(validateUsername('  Jo  '), '');
  assert.equal(validateUsername('a'.repeat(32)), '');
  assert.equal(validateUsername('   '), 'Name is required.');
  assert.equal(validateUsername('a'), 'Name must be at least 2 characters.');
  assert.equal(
    validateUsername('a'.repeat(33)),
    'Name must be at most 32 characters.',
  );
});

test('validates avatar type and one megabyte limit', () => {
  assert.equal(validateAvatar(null), '');
  assert.equal(
    validateAvatar({ type: 'application/pdf', size: 100 }),
    'Only images are allowed.',
  );
  assert.equal(
    validateAvatar({ type: 'image/png', size: MAX_AVATAR_SIZE + 1 }),
    'Maximum file size is 1 MB.',
  );
  assert.equal(
    validateAvatar({ type: 'image/png', size: MAX_AVATAR_SIZE }),
    '',
  );
});

test('detects username and avatar changes after trimming', () => {
  assert.equal(hasProfileChanges('Current name', ' Current name ', null), false);
  assert.equal(hasProfileChanges('Current name', 'New name', null), true);
  assert.equal(
    hasProfileChanges('Current name', 'Current name', {
      type: 'image/png',
      size: 100,
    }),
    true,
  );
});

test('builds multipart data from changed profile fields only', () => {
  const avatar = new File(['avatar'], 'avatar.png', { type: 'image/png' });
  const changed = buildProfileFormData('Current name', ' New name ', avatar);
  const unchanged = buildProfileFormData('Current name', ' Current name ', null);

  assert.equal(changed.get('username'), 'New name');
  assert.equal(changed.get('avatar'), avatar);
  assert.deepEqual([...unchanged.entries()], []);
});
