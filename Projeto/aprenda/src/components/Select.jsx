import styles from "./Select.module.css";

const Select = ({
  label,
  options,
  onChange,
  value,
  resetOnChange,
  disabled,
}) => {
  return (
    <label>

      <select
        value={value}
        onChange={(e) => {
          // Se resetOnChange for verdadeiro, a lógica de reset é chamada
          if (resetOnChange) {
            onChange(e, true); // Indica que o valor da outra opção deve ser resetado
          } else {
            onChange(e); // Atualiza o valor normalmente
          }

        }}
        disabled={disabled}
        
      >
        {/* A opção default estará desabilitada e oculta */}
        <option value="" disabled hidden>
        {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
