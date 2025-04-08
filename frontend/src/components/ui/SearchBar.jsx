import React, { useState } from "react";

import "./SearchBar.scss";


function SearchBar({ onChange }) {

    const [searchItem, setSearchItem] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchItem(value);
        onChange(value);
    };

    return (
        <input className="search-input"
            type="text"
            placeholder="запрос"
            value={searchItem}
            onChange={handleChange}
        />
    );
}

export default SearchBar;
