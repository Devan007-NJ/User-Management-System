import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile, uploadProfileImage } from '../../api/profile';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const emailValue = email ?? profile?.email ?? '';

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const updateMutation = useMutation({
    mutationFn: () => updateProfile(emailValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: () => uploadProfileImage(selectedFile!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSelectedFile(null);
    },
  });

  if (isLoading) return (
    <div className="terminal-state">
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="panel-page">
      <div className="workspace-header">
        <div>
          <p className="workspace-kicker">[profile]</p>
          <h2>My Profile</h2>
          <p>Manage your account details</p>
        </div>
      </div>

      <div className="stacked-sections">
        <div className="terminal-section narrow">
          <div className="terminal-section-title">
            <span>[profile image]</span>
          </div>

          <div className="profile-image-row">
            <div className="profile-avatar">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : profile?.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${profile.profile_image}`}
                  alt="Profile"
                />
              ) : (
                <span>{profile?.email[0]}</span>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                uploadMutation.mutate();
              }}
              className="upload-controls"
            >
              <label>
                <span className="terminal-button compact">
                  <span aria-hidden="true">[^]</span>
                  Choose Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only-file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>

              {selectedFile && (
                <div className="upload-selected">
                  <p>{selectedFile.name}</p>
                  <button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="terminal-button compact"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              )}

              {uploadMutation.isSuccess && (
                <p className="terminal-message success">Image updated.</p>
              )}
            </form>
          </div>
        </div>

        <div className="terminal-section narrow">
          <div className="terminal-section-title">
            <span>[account details]</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate();
            }}
            className="terminal-form"
          >
            <div className="terminal-field">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={emailValue}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {updateMutation.isSuccess && (
              <p className="terminal-message success">Email updated.</p>
            )}

            {updateMutation.isError && (
              <p className="terminal-message danger">Update failed.</p>
            )}

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="terminal-button"
            >
              <span aria-hidden="true">[-&gt;]</span>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
