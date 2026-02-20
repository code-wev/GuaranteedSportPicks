import ActivePickCard from "./components/ActivePickCard";
import PieChart from "./components/PieChart";
import QuickActions from "./components/QuickActions";
import StatCard from "./components/StateCard";
import WelcomeCard from "./components/WelcomeCard";


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeCard />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active picks" value="3" change="+2 this week" icon="pick" />
        <StatCard title="Total wins" value="47" change="+5 this month" icon="win" />
        <StatCard title="Win Rate" value="68%" change="+2 this month" icon="rate" />
        <StatCard title="Wallet Balance" value="$125.50" change="+45 today" icon="wallet" />
      </div>

      {/* Chart + Active Picks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart />
        <ActivePickCard />
      </div>

      <QuickActions />
    </div>
  );
}
