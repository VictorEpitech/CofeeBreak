const Input = ({
  htmlFor,
  labelText,
  inputName,
  inputType = "text",
  inputPlaceholder = "",
  inputValue,
  onInputChange,
  required = false,
  error,
}) => {
  return (
    <div className="form-control">
      <label htmlFor={htmlFor} className="label">
        <span className="label-text">{labelText}</span>
      </label>
      <input
        required={required}
        className="input input-bordered"
        name={inputName}
        type={inputType}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={onInputChange}
      />
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Input;
