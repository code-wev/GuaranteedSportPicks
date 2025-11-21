export default function ActivePickCard() {
  const picks = [
    {
      match: "Lakers vs Warriors",
      price: "$25.00",
      date: "15-05-2024",
      time: "08:00 PM",
      status: "Won",
    },
    {
      match: "Chiefs vs Bills",
      price: "$50.00",
      date: "15-05-2024",
      time: "06:30 PM",
      status: "Pending",
    },
    {
      match: "Dodgers vs Giants",
      price: "+$60.00",
      date: "15-05-2024",
      time: "09:15 PM",
      status: "Lost",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl">Active Picks</h3>
        <span className="text-[#DC2626] text-sm cursor-pointer">View All</span>
      </div>

      <div className="mt-5 space-y-4">
        {picks.map((p, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-2 border border-gray-100 pb-3"
          >
            <div>
              <p className="font-medium">{p.match}</p>
              <p className="text-xs text-gray-500">{p.time}</p>
            </div>

            <div className="text-right flex gap-2 items-center">
              <div className="">
                <p className="font-semibold">{p.price}</p>
                <p className="text-xs">{p.date}</p>
              </div>
              <span
                className={`text-xs w-16 h-6 flex items-center justify-center text-white rounded-full
                ${
                  p.status === "Won"
                    ? "bg-[#43A047]"
                    : p.status === "Pending"
                    ? "bg-[#FB8C00]"
                    : "bg-[#E53935]"
                }`}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
