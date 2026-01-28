import { useState, useRef } from "react";
import { ArrowLeft, Camera, X, Check, User, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delivery } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";

interface ReceiptCaptureProps {
  delivery: Delivery;
  onBack: () => void;
  onComplete: () => void;
}

export function ReceiptCapture({ delivery, onBack, onComplete }: ReceiptCaptureProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState("");
  const [receiverDoc, setReceiverDoc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      toast({
        title: "Foto obrigatória",
        description: "Tire uma foto do canhoto assinado",
        variant: "destructive",
      });
      return;
    }

    if (!receiverName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome de quem recebeu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Canhoto registrado!",
      description: `Entrega ${delivery.nf} confirmada com sucesso`,
    });
    
    setIsSubmitting(false);
    onComplete();
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
            <h1 className="font-semibold">Registrar Canhoto</h1>
            <p className="text-xs text-muted-foreground">{delivery.nf} - {delivery.client}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-32 space-y-4">
        {/* Photo Capture */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-primary" />
            Foto do Canhoto
          </h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {!photo ? (
            <button
              onClick={handleCapture}
              className="w-full aspect-[4/3] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 bg-secondary/50 transition-colors active:bg-secondary"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">Tirar Foto</p>
                <p className="text-xs text-muted-foreground">Toque para abrir a câmera</p>
              </div>
            </button>
          ) : (
            <div className="relative">
              <img 
                src={photo} 
                alt="Canhoto" 
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
              <button
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Receiver Info */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Dados do Recebedor
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Nome Completo *
              </label>
              <Input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Nome de quem recebeu"
                className="bg-secondary border-0 h-12"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                CPF/RG (opcional)
              </label>
              <Input
                value={receiverDoc}
                onChange={(e) => setReceiverDoc(e.target.value)}
                placeholder="Documento do recebedor"
                className="bg-secondary border-0 h-12"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="floating-action safe-area-bottom">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full touch-action-btn bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Confirmar Entrega
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
