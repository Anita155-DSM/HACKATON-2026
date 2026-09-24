export const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-colors duration-300 ${className}`}>
      {title && (
        <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors">
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};