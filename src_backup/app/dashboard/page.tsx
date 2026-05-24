import { 
  BarChart3, 
  Users, 
  Activity, 
  ArrowUpRight 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
          Welcome back
        </h1>
        <p className="text-slate-500 mt-2">Here's what's happening with your projects today.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Total Active Projects" 
          value="12" 
          change="+2.5%" 
          icon={<Activity className="w-5 h-5 text-blue-600" />} 
        />
        <MetricCard 
          title="Team Members" 
          value="48" 
          change="+12%" 
          icon={<Users className="w-5 h-5 text-indigo-600" />} 
        />
        <MetricCard 
          title="Monthly Revenue" 
          value="$24,500" 
          change="+8.1%" 
          icon={<BarChart3 className="w-5 h-5 text-sky-600" />} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="h-full w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-center">
            <span className="text-slate-400">Chart rendering area</span>
          </div>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <div>
                  <p className="text-sm font-medium">New module deployed</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <div className="glass-panel p-6 flex flex-col gap-4 group hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {change}
        </span>
      </div>
    </div>
  );
}
