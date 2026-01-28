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
      className="w-full glass-card rounded-xl p-4 text-left transition-all active:scale-[0.98] hover:bg-card/90"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground">{delivery.nf}</span>
            {isPriority && (
              <span className="flex items-center gap-1 text-warning text-xs">
                <AlertTriangle className="w-3 h-3" />
                Prioritário
              </span>
            )}
          </div>
          
          <h3 className="font-medium text-sm text-foreground truncate mb-2">
            {delivery.client}
          </h3>
          
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{delivery.address}</span>
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            {delivery.scheduledTime && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                <span>{delivery.scheduledTime}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Package className="w-3 h-3" />
              <span>{delivery.items} itens</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`status-badge ${getStatusClass(delivery.status)}`}>
            {getStatusLabel(delivery.status)}
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}
