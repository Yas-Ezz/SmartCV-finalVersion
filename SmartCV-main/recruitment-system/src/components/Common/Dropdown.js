import React from "react";

const Dropdown = ({ options, value, onChange, placeholder }) => (
    <select value={value} onChange={onChange} required>
        <option value="">{placeholder}</option>
        {options.map((option) => (
            <option key={option.DepartmentID || option.JobID} value={option.DepartmentID || option.JobID}>
                {option.Name || option.Title}
            </option>
        ))}
    </select>
);

export default Dropdown;
