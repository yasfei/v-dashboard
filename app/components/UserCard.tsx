interface UserCardProps {
  title: string;
  value: number;
  trend?: string;
}

export default function UserCard({ title, value, trend }: UserCardProps) {
  return (
    <div className="bg-[#222729] rounded-xl p-6 flex-1 min-w-[250px] shadow-lg">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <h2 className="text-4xl font-bold">{value}</h2>
      {trend && (
        <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
          ↑ <span>{trend}</span>
        </p>
      )}
    </div>
  );
}
