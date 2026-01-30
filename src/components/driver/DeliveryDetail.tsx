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
      <header className="glass-card sticky top-0 z-40 px-4 py-4 safe-area-top">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            aria-label="Voltar"
            className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center active:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl">{delivery.nf}</h1>
            <p className="text-sm text-muted-foreground font-medium">{delivery.client}</p>
          </div>
          <span className={`status-badge ${getStatusClass(delivery.status)}`}>
            {getStatusLabel(delivery.status)}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-48 space-y-4">
        {/* Priority Alert */}
        {delivery.priority === 'high' && (
          <div className="glass-card rounded-2xl p-5 border-warning/30 bg-warning/10">
            <div className="flex items-center gap-3 text-warning">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold text-lg">Entrega Prioritária</span>
            </div>
          </div>
        )}

        {/* Address Card */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base leading-relaxed">{delivery.address}</p>
              <p className="text-sm text-muted-foreground mt-1">{delivery.city}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleNavigate}
              className="touch-action-btn bg-accent hover:bg-accent/90 text-accent-foreground text-base"
            >
              <Navigation className="w-6 h-6 mr-2" />
              Navegar
            </Button>
            <Button 
              onClick={handleCall}
              variant="secondary"
              className="touch-action-btn text-base"
              disabled={!delivery.phone}
            >
              <Phone className="w-6 h-6 mr-2" />
              Ligar
            </Button>
          </div>
        </div>

        {/* Details Card */}
        <div className="glass-card rounded-2xl p-5 space-y-5">
          <h3 className="font-bold text-base flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            Detalhes da Entrega
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Horário</span>
              </div>
              <p className="font-bold text-lg">{delivery.scheduledTime || '--:--'}</p>
            </div>
            <div className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Itens</span>
              </div>
              <p className="font-bold text-lg">{delivery.items} peças</p>
            </div>
          </div>

          {delivery.notes && (
            <div className="bg-secondary rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Observações</p>
              <p className="text-base leading-relaxed">{delivery.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Actions */}
      <div className="floating-action">
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <Button 
            onClick={onRegisterReceipt}
            className="w-full touch-action-btn bg-primary hover:bg-primary/90 text-base"
            disabled={delivery.status === 'delivered'}
          >
            <Camera className="w-6 h-6 mr-3" />
            Registrar Canhoto
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={onRegisterOccurrence}
              variant="outline"
              className="touch-action-btn border-warning text-warning hover:bg-warning/10 text-base"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Ocorrência
            </Button>
            <Button 
              variant="outline"
              className="touch-action-btn border-destructive text-destructive hover:bg-destructive/10 text-base"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Recusar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
