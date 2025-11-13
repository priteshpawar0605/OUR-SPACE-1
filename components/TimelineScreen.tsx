
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import Icon from './Icon';
import { Memory } from '../types';

const TimelineScreen: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { memories, setMemories, photos } = context;
    const [newMemoryText, setNewMemoryText] = useState('');
    const [newMemoryDate, setNewMemoryDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | undefined>(undefined);

    const handleAddMemory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMemoryText.trim() === '') return;

        const newMemory: Memory = {
            id: new Date().toISOString(),
            date: newMemoryDate,
            text: newMemoryText,
            photoUrl: selectedPhotoUrl,
        };
        setMemories([newMemory, ...memories].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setNewMemoryText('');
        setSelectedPhotoUrl(undefined);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-main mb-6">Our Memory Timeline</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-bold text-accent mb-4">Add a new memory</h2>
                <form onSubmit={handleAddMemory} className="space-y-4">
                    <textarea
                        value={newMemoryText}
                        onChange={(e) => setNewMemoryText(e.target.value)}
                        placeholder="What happened?"
                        className="w-full p-2 border border-secondary/50 rounded-lg focus:ring-accent focus:border-accent"
                        rows={3}
                        required
                    />
                    <input
                        type="date"
                        value={newMemoryDate}
                        onChange={(e) => setNewMemoryDate(e.target.value)}
                        className="w-full p-2 border border-secondary/50 rounded-lg"
                        required
                    />
                     <div className="max-h-32 overflow-x-auto whitespace-nowrap py-2">
                        <p className="text-sm text-text-light mb-2">Attach a photo from gallery (optional):</p>
                        <div className="flex space-x-2">
                            {photos.map(photo => (
                                <img key={photo.id} src={photo.url} alt={photo.caption} onClick={() => setSelectedPhotoUrl(photo.url)} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-4 ${selectedPhotoUrl === photo.url ? 'border-heart' : 'border-transparent'}`}/>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition-colors shadow">
                        Add to Timeline
                    </button>
                </form>
            </div>
            
            <div className="relative pl-8">
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary rounded-full"></div>

                {memories.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-text-light">Your timeline is just beginning. Add your first memory!</p>
                    </div>
                ) : (
                    memories.map((memory, index) => (
                    <div key={memory.id} className="mb-8 relative">
                         <div className="absolute -left-5 top-1.5 w-6 h-6 bg-heart rounded-full border-4 border-background"></div>
                         <div className="bg-white p-4 rounded-lg shadow-md ml-4">
                            <p className="font-bold text-accent">{new Date(memory.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-text-main my-2">{memory.text}</p>
                            {memory.photoUrl && <img src={memory.photoUrl} alt="Memory" className="mt-2 rounded-lg max-h-60" />}
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TimelineScreen;
