import { MapPin, Phone, Clock, ChevronRight, Package, AlertTriangle } from "lucide-react";
import { Delivery } from "@/types/delivery";
import { getStatusLabel, getStatusClass } from "@/data/mockDeliveries";

interface DeliveryCardProps {
  delivery: Delivery;
  onSelect: (delivery: Delivery) => void;
}

export function DeliveryCard({ delivery, onSelect }: DeliveryCardProps) {
  const isPriority = delivery.priority === 'high';
  
  return (
    <button
      onClick={() => onSelect(delivery)}
      aria-label={`Entrega ${delivery.nf} para ${delivery.client}`}
      className="w-full glass-card rounded-2xl p-5 text-left transition-all active:scale-[0.98] hover:bg-card/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg text-foreground">{delivery.nf}</span>
            {isPriority && (
              <span className="flex items-center gap-1.5 text-warning text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Prioritário
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-base text-foreground mb-3">
            {delivery.client}
          </h3>
          
          <div className="flex items-start gap-2 text-muted-foreground text-sm mb-2">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{delivery.address}</span>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            {delivery.scheduledTime && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{delivery.scheduledTime}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Package className="w-4 h-4" />
              <span className="font-medium">{delivery.items} itens</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <span className={`status-badge ${getStatusClass(delivery.status)}`}>
            {getStatusLabel(delivery.status)}
          </span>
          <ChevronRight className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}
