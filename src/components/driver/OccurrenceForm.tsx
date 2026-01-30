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
            <h1 className="font-bold text-xl text-warning">Registrar Ocorrência</h1>
            <p className="text-sm text-muted-foreground font-medium">{delivery.nf} - {delivery.client}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-40 space-y-5">
        {/* Type Selection */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base flex items-center gap-3 mb-5">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Tipo de Ocorrência
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {occurrenceTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                aria-pressed={selectedType === type.value}
                className={`p-4 rounded-xl text-left transition-all min-h-[80px] ${
                  selectedType === type.value
                    ? 'bg-warning/20 border-2 border-warning'
                    : 'bg-secondary border-2 border-transparent active:bg-secondary/80'
                }`}
              >
                <span className="text-2xl mb-2 block">{type.icon}</span>
                <span className="text-sm font-semibold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base mb-4">Descrição</h3>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o que aconteceu..."
            className="bg-secondary border-0 min-h-[120px] resize-none text-base"
          />
        </div>

        {/* Photos */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base flex items-center gap-3 mb-5">
            <Camera className="w-5 h-5 text-primary" />
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
          
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img 
                  src={photo} 
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  aria-label={`Remover foto ${index + 1}`}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              </div>
            ))}
            {photos.length < 4 && (
              <button
                onClick={handleCapture}
                aria-label="Adicionar foto"
                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-secondary/50 transition-colors active:bg-secondary min-h-[100px]"
              >
                <Plus className="w-8 h-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="floating-action">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full touch-action-btn bg-warning hover:bg-warning/90 text-warning-foreground text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-6 h-6 mr-3" />
              Enviar Ocorrência
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
