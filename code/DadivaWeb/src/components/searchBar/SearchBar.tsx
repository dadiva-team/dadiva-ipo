import React, { useEffect, useState } from 'react';
import { getDnD } from '../../services/dnd/dnd';

export default function SearchBar() {
  const [searchItem, setSearchItem] = useState('');
  const [filteredDnD, setFilteredDnD] = useState([]);
  const [allDnD, setAllDnD] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    getDnD()
      .then(dnd => {
        console.log(dnd);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setAllDnD(dnd);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setFilteredDnD(dnd);
      })
      .catch(e => console.log(e));
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = allDnD.filter(dnd => dnd.toLowerCase().includes(searchTerm.toLowerCase()));

    setFilteredDnD(filteredItems);
    setShowSuggestions(true);
  }

  function handleSuggestionClick(suggestion: string) {
    setSearchItem(suggestion);
    setShowSuggestions(false);
  }

  function handleOutsideClick() {
    setShowSuggestions(false);
  }

  return (
    <div onClick={handleOutsideClick}>
      <input type="text" value={searchItem} onChange={handleInputChange} placeholder="Type to search" />
      {showSuggestions && <Suggestions suggestions={filteredDnD} onClick={handleSuggestionClick} />}
    </div>
  );
}

type suggestionProps = {
  suggestions: string[];
  onClick: ([]) => void;
};

function Suggestions({ suggestions, onClick }: suggestionProps) {
  return (
    <ul className="suggestions">
      {suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => onClick(suggestion)}>
          {suggestion}
        </li>
      ))}
    </ul>
  );
}
