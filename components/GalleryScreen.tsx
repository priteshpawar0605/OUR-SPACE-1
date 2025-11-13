
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import Icon from './Icon';
import { Photo } from '../types';

const GalleryScreen: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { photos, setPhotos } = context;

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPhoto: Photo = {
                    id: new Date().toISOString(),
                    url: e.target?.result as string,
                    caption: 'A beautiful moment',
                };
                setPhotos([newPhoto, ...photos]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const deletePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
        if(selectedPhoto?.id === id) setSelectedPhoto(null);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-main">Our Gallery</h1>
                <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <button onClick={triggerFileInput} className="flex items-center bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition-colors shadow">
                    <Icon name="upload" className="mr-2" />
                    Add Photo
                </button>
            </div>

            {photos.length === 0 ? (
                 <div className="text-center py-20">
                    <Icon name="gallery" className="w-16 h-16 mx-auto text-text-light mb-4"/>
                    <p className="text-text-light">Your gallery is empty.</p>
                    <p className="text-text-light">Upload your first photo to start your collection!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                        <div key={photo.id} className="relative group aspect-square cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover rounded-lg shadow-md transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                <p className="text-white text-center p-2">{photo.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="max-h-[80vh] w-auto mx-auto rounded-lg" />
                        <p className="text-center mt-4 text-text-main">{selectedPhoto.caption}</p>
                        <button onClick={() => setSelectedPhoto(null)} className="absolute top-2 right-2 bg-white/50 p-2 rounded-full text-text-main hover:bg-gray-200">
                             <Icon name="x" />
                        </button>
                         <button onClick={() => deletePhoto(selectedPhoto.id)} className="absolute top-2 left-2 bg-red-100 p-2 rounded-full text-red-500 hover:bg-red-200">
                             <Icon name="trash" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryScreen;
