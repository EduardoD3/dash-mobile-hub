import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, X, Check, User, FileText, Loader2, ImagePlus, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const requestCameraPermission = useCallback(async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      
      streamRef.current = stream;
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      setIsCapturing(false);
      toast({
        title: "Permissão negada",
        description: "Por favor, permita o acesso à câmera nas configurações do dispositivo",
        variant: "destructive",
      });
    }
  }, [toast]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const handleCapture = () => {
    if (cameraPermission === 'granted' && isCapturing) {
      capturePhoto();
    } else {
      requestCameraPermission();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
        stopCamera();
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
            Foto do Canhoto Assinado
          </h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {isCapturing && !photo ? (
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full aspect-[4/3] object-cover rounded-xl bg-secondary"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
                <Button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                >
                  <ScanLine className="w-8 h-8" />
                </Button>
              </div>
              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-center gap-2 bg-background/80 backdrop-blur rounded-lg px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs font-medium">Câmera ativa</span>
                </div>
              </div>
            </div>
          ) : !photo ? (
            <div className="space-y-3">
              <button
                onClick={handleCapture}
                className="w-full aspect-[4/3] border-2 border-dashed border-primary/50 rounded-xl flex flex-col items-center justify-center gap-3 bg-primary/5 transition-all active:bg-primary/10 active:scale-[0.99]"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base">Abrir Câmera</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {cameraPermission === 'denied' 
                      ? 'Permissão negada - verifique as configurações' 
                      : 'Toque para capturar o canhoto assinado'}
                  </p>
                </div>
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>
              
              <Button
                onClick={handleFileSelect}
                variant="outline"
                className="w-full h-14 gap-2"
              >
                <ImagePlus className="w-5 h-5" />
                Selecionar da Galeria
              </Button>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={photo} 
                alt="Canhoto capturado" 
                className="w-full aspect-[4/3] object-cover rounded-xl border-2 border-primary/30"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleRemovePhoto}
                  className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                >
                  <X className="w-5 h-5 text-destructive-foreground" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <div className="flex items-center gap-1 bg-primary/90 backdrop-blur rounded-lg px-2 py-1">
                  <Check className="w-3 h-3 text-primary-foreground" />
                  <span className="text-xs font-medium text-primary-foreground">Capturado</span>
                </div>
              </div>
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
                placeholder="Nome de quem recebeu a entrega"
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

        {/* Notes */}
        <div className="glass-card rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Observações da Entrega
          </h3>
          
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione observações sobre a entrega, condições do produto, local de entrega, etc."
            className="bg-secondary border-0 min-h-[100px] resize-none"
          />
        </div>

        {/* Delivery Summary */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-accent" />
            Resumo da Entrega
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nota Fiscal</span>
              <span className="font-medium">{delivery.nf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente</span>
              <span className="font-medium">{delivery.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Itens</span>
              <span className="font-medium">{delivery.items} peças</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Endereço</span>
              <span className="font-medium text-right max-w-[180px]">{delivery.address}</span>
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
