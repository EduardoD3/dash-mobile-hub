import { Package, Bell, User } from "lucide-react";

interface DriverHeaderProps {
  driverName: string;
  totalDeliveries: number;
  completedDeliveries: number;
}

export function DriverHeader({ driverName, totalDeliveries, completedDeliveries }: DriverHeaderProps) {
  const progress = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

  return (
    <header className="glass-card sticky top-0 z-40 px-4 py-3 safe-area-top">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Olá,</p>
            <h1 className="text-sm font-semibold">{driverName}</h1>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
            2
          </span>
        </button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Entregas de Hoje</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {completedDeliveries}/{totalDeliveries}
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {totalDeliveries - completedDeliveries} entregas restantes
        </p>
      </div>
    </header>
  );
}
