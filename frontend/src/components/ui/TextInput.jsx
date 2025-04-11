import React, { useState } from "react";

import "./TextInput.scss";

export const textInputTypes = {
    EMAIL: "email",
    PASSWORD: "password",
    TEXT: "text"
}

function TextInput({ id, type, placeholder, onChange }) {
    type ??= textInputTypes.TEXT; 

    const [value, setValue] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setValue(value);
        onChange && onChange(value);
    };

    return (
        <input className="TextInput"
            id={ id }
            type={ type }
            placeholder={ placeholder }
            value={value}
            onChange={handleChange}
        />
    );
}

export default TextInput;
