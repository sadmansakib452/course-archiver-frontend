interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-500 dark:text-red-400">
      {message}
    </div>
  );
}; 