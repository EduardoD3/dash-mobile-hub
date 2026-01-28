import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Package, 
  Navigation, 
  Camera,
  AlertTriangle,
  FileText,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Delivery } from "@/types/delivery";
import { getStatusLabel, getStatusClass } from "@/data/mockDeliveries";
import { Button } from "@/components/ui/button";

interface DeliveryDetailProps {
  delivery: Delivery;
  onBack: () => void;
  onRegisterReceipt: () => void;
  onRegisterOccurrence: () => void;
}

export function DeliveryDetail({ 
  delivery, 
  onBack, 
  onRegisterReceipt, 
  onRegisterOccurrence 
}: DeliveryDetailProps) {
  const handleNavigate = () => {
    const address = encodeURIComponent(`${delivery.address}, ${delivery.city}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const handleCall = () => {
    if (delivery.phone) {
      window.open(`tel:${delivery.phone}`, '_self');
    }
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="glass-card sticky top-0 z-40 px-4 py-3 safe-area-top">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{delivery.nf}</h1>
            <p className="text-xs text-muted-foreground">{delivery.client}</p>
          </div>
          <span className={`status-badge ${getStatusClass(delivery.status)}`}>
            {getStatusLabel(delivery.status)}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-32 space-y-4">
        {/* Priority Alert */}
        {delivery.priority === 'high' && (
          <div className="glass-card rounded-xl p-4 border-warning/30 bg-warning/10">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Entrega Prioritária</span>
            </div>
          </div>
        )}

        {/* Address Card */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{delivery.address}</p>
              <p className="text-xs text-muted-foreground">{delivery.city}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleNavigate}
              className="touch-action-btn bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Navegar
            </Button>
            <Button 
              onClick={handleCall}
              variant="secondary"
              className="touch-action-btn"
              disabled={!delivery.phone}
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar
            </Button>
          </div>
        </div>

        {/* Details Card */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Detalhes da Entrega
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Horário</span>
              </div>
              <p className="font-semibold">{delivery.scheduledTime || '--:--'}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Package className="w-4 h-4" />
                <span className="text-xs">Itens</span>
              </div>
              <p className="font-semibold">{delivery.items} peças</p>
            </div>
          </div>

          {delivery.notes && (
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Observações</p>
              <p className="text-sm">{delivery.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Actions */}
      <div className="floating-action safe-area-bottom">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <Button 
            onClick={onRegisterReceipt}
            className="w-full touch-action-btn bg-primary hover:bg-primary/90"
            disabled={delivery.status === 'delivered'}
          >
            <Camera className="w-5 h-5 mr-2" />
            Registrar Canhoto
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onRegisterOccurrence}
              variant="outline"
              className="touch-action-btn border-warning text-warning hover:bg-warning/10"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Ocorrência
            </Button>
            <Button 
              variant="outline"
              className="touch-action-btn border-destructive text-destructive hover:bg-destructive/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Recusar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
