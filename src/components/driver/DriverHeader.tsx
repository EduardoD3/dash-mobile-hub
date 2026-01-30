import { Package, Bell, User } from "lucide-react";

interface DriverHeaderProps {
  driverName: string;
  totalDeliveries: number;
  completedDeliveries: number;
}

export function DriverHeader({ driverName, totalDeliveries, completedDeliveries }: DriverHeaderProps) {
  const progress = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

  return (
    <header className="glass-card sticky top-0 z-40 px-4 py-4 safe-area-top">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Olá,</p>
            <h1 className="text-lg font-bold">{driverName}</h1>
          </div>
        </div>
        <button 
          aria-label="Notificações"
          className="relative w-14 h-14 rounded-full bg-secondary flex items-center justify-center active:bg-secondary/80 transition-colors"
        >
          <Bell className="w-6 h-6 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full text-xs font-bold flex items-center justify-center text-destructive-foreground">
            2
          </span>
        </button>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold">Entregas de Hoje</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {completedDeliveries}/{totalDeliveries}
          </span>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={completedDeliveries}
            aria-valuemin={0}
            aria-valuemax={totalDeliveries}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3 font-medium">
          {totalDeliveries - completedDeliveries} entregas restantes
        </p>
      </div>
    </header>
  );
}
