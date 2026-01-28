import { useState, useRef } from "react";
import { ArrowLeft, Camera, X, AlertTriangle, Plus, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Delivery, OccurrenceType } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";

interface OccurrenceFormProps {
  delivery: Delivery;
  onBack: () => void;
  onComplete: () => void;
}

const occurrenceTypes: { value: OccurrenceType; label: string; icon: string }[] = [
  { value: 'damage', label: 'Avaria no Produto', icon: '💔' },
  { value: 'refused', label: 'Cliente Recusou', icon: '🚫' },
  { value: 'partial', label: 'Entrega Parcial', icon: '📦' },
  { value: 'reschedule', label: 'Reagendamento', icon: '📅' },
  { value: 'other', label: 'Outro', icon: '📝' },
];

export function OccurrenceForm({ delivery, onBack, onComplete }: OccurrenceFormProps) {
  const [selectedType, setSelectedType] = useState<OccurrenceType | null>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
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
        setPhotos(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast({
        title: "Selecione o tipo",
        description: "Escolha o tipo de ocorrência",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Descreva o que aconteceu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Ocorrência registrada!",
      description: "O supervisor será notificado",
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
            <h1 className="font-semibold text-warning">Registrar Ocorrência</h1>
            <p className="text-xs text-muted-foreground">{delivery.nf} - {delivery.client}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-32 space-y-4">
        {/* Type Selection */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Tipo de Ocorrência
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {occurrenceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedType === type.value
                    ? 'bg-warning/20 border-2 border-warning'
                    : 'bg-secondary border-2 border-transparent'
                }`}
              >
                <span className="text-xl mb-1 block">{type.icon}</span>
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-3">Descrição</h3>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o que aconteceu..."
            className="bg-secondary border-0 min-h-[100px] resize-none"
          />
        </div>

        {/* Photos */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-primary" />
            Fotos (opcional)
          </h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={photo} 
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <button
                onClick={handleCapture}
                className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 bg-secondary/50 transition-colors active:bg-secondary"
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="floating-action safe-area-bottom">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full touch-action-btn bg-warning hover:bg-warning/90 text-warning-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Enviar Ocorrência
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
