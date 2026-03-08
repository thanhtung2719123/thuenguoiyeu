import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './ImageUpload.css';

interface ImageUploadProps {
    bucket: 'avatars' | 'galleries';
    onUploadSuccess: (url: string) => void;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ bucket, onUploadSuccess, label }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Show local preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Upload to Supabase
            const { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onUploadSuccess(publicUrl);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-upload-container">
            {label && <label className="upload-label">{label}</label>}

            <div className="upload-zone card glass">
                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                        <button className="remove-btn" onClick={() => setPreview(null)}>
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <label className="upload-placeholder">
                        <div className="icon-bg pink">
                            <Upload size={24} className="pink-text" />
                        </div>
                        <div className="upload-text">
                            <span className="bold">Click to upload</span>
                            <span className="text-subtle">PNG, JPG up to 5MB</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                            className="hidden-input"
                        />
                    </label>
                )}

                {uploading && (
                    <div className="upload-overlay">
                        <Loader2 className="spinner pink-text" size={32} />
                        <p>Uploading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
