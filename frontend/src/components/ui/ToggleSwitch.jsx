export const ToggleSwitch = ({ checked, onChange, label }) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`w-12 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
    }`}
  >
    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
      checked ? "translate-x-6" : "translate-x-0"
    }`}></div>
  </button>
);