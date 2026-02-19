import React, { useState } from 'react';
import { Button } from '@/components/ui';
import styles from './EscalationForm.module.css';

interface EscalationFormProps {
  assetId: string;
  assetName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  initialDescription?: string; // Add this
  isLoadingDescription?: boolean; // Add this
  onClose: () => void;
  onSubmit: (data: EscalationData) => Promise<void>;
}

export interface EscalationData {
  assetId: string;
  assetName: string;
  userName: string;
  email: string;
  phone: string;
  issueDescription: string;
  additionalInfo: string;
  images: File[];
}

export const EscalationForm: React.FC<EscalationFormProps> = ({
  assetId,
  assetName,
  contactName,
  contactEmail,
  contactPhone,
  initialDescription = '', // Add this
  isLoadingDescription = false, // Add this
  onClose,
  onSubmit,
}) => {
  const [userName, setUserName] = useState(contactName || '');
  const [email, setEmail] = useState(contactEmail || '');
  const [phone, setPhone] = useState(contactPhone || '');
  const [issueDescription, setIssueDescription] = useState(initialDescription);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update description when initialDescription changes (from API)
  React.useEffect(() => {
    if (initialDescription) {
      setIssueDescription(initialDescription);
    }
  }, [initialDescription]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !email || !issueDescription) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        assetId,
        assetName,
        userName,
        email,
        phone,
        issueDescription,
        additionalInfo,
        images,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🔺 Submit to Expert</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.assetInfo}>
          <strong>Asset:</strong> {assetName}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3>Contact Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="userName">
                Name <span className={styles.required}>*</span>
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Issue Details</h3>

            <div className={styles.formGroup}>
              <label htmlFor="issueDescription">
                Issue Description <span className={styles.required}>*</span>
              </label>
              {isLoadingDescription ? (
                <div className={styles.loadingDescription}>
                  <span className={styles.spinner}></span>
                  Generating summary from chat...
                </div>
              ) : (
                <textarea
                  id="issueDescription"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue you're experiencing..."
                  rows={4}
                  required
                />
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Any additional details that might help..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Attachments</h3>

            <div className={styles.formGroup}>
              <label htmlFor="images">Upload Images (Optional)</label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <p className={styles.hint}>
                You can upload multiple images (JPG, PNG, etc.)
              </p>
            </div>

            {images.length > 0 && (
              <div className={styles.imagePreview}>
                {images.map((file, index) => (
                  <div key={index} className={styles.imageItem}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeImage}
                    >
                      ✕
                    </button>
                    <span className={styles.imageName}>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
