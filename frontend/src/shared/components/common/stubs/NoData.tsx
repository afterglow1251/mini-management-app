type NoDataProps = {
  message?: string;
};

export function NoData({ message = "No data available" }: NoDataProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
      {message}
    </div>
  );
}
