import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm người bạn đồng hành..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="location-btn text-subtle">
                    <MapPin size={16} />
                    Hà Nội
                </button>
            </div>
            <button className="filter-btn btn-primary">
                <Filter size={20} />
            </button>
        </div>
    );
};

export default SearchBar;
