import React, { useState } from "react";

import "./TextInput.scss";

function TextInput({ placeholder, onChange }) {

    const [searchItem, setSearchItem] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchItem(value);
        onChange && onChange(value);
    };

    return (
        <input className="TextInput"
            type="text"
            placeholder={ placeholder }
            value={searchItem}
            onChange={handleChange}
        />
    );
}

export default TextInput;
