import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, X, Check, User, FileText, Loader2, ImagePlus, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Delivery } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReceiptCaptureProps {
  delivery: Delivery;
  onBack: () => void;
  onComplete: () => void;
}

export function ReceiptCapture({ delivery, onBack, onComplete }: ReceiptCaptureProps) {
  const { t } = useLanguage();
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
        title: t('camera_permission'),
        description: t('camera_permission_desc'),
        variant: "destructive",
      });
    }
  }, [toast, t]);

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
        title: t('receipt_photo'),
        description: t('take_photo'),
        variant: "destructive",
      });
      return;
    }

    if (!receiverName.trim()) {
      toast({
        title: t('receiver_name'),
        description: t('receiver_data'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: t('save_receipt'),
      description: `${t('nav_deliveries')} ${delivery.nf}`,
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
            aria-label={t('back')}
            className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center active:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-xl">{t('receipt_capture')}</h1>
            <p className="text-sm text-muted-foreground font-medium">{delivery.nf} - {delivery.client}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-40 space-y-5">
        {/* Photo Capture */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-primary">
          <h3 className="font-bold text-base flex items-center gap-3 mb-5">
            <Camera className="w-5 h-5 text-primary" />
            {t('receipt_photo')}
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
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                <Button
                  onClick={stopCamera}
                  variant="secondary"
                  aria-label={t('cancel')}
                  className="w-16 h-16 rounded-full"
                >
                  <X className="w-7 h-7" />
                </Button>
                <Button
                  onClick={capturePhoto}
                  aria-label={t('capture')}
                  className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90"
                >
                  <ScanLine className="w-10 h-10" />
                </Button>
              </div>
              <div className="absolute top-4 left-4 right-4">
                <div className="flex items-center justify-center gap-3 bg-background/80 backdrop-blur rounded-xl px-4 py-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold">{t('camera_ready')}</span>
                </div>
              </div>
            </div>
          ) : !photo ? (
            <div className="space-y-4">
              <button
                onClick={handleCapture}
                className="w-full aspect-[4/3] border-2 border-dashed border-primary/50 rounded-2xl flex flex-col items-center justify-center gap-4 bg-primary/5 transition-all active:bg-primary/10 active:scale-[0.99]"
              >
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center px-4">
                  <p className="font-bold text-lg">{t('take_photo')}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cameraPermission === 'denied' 
                      ? t('camera_permission') 
                      : t('camera_permission_desc')}
                  </p>
                </div>
              </button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">ou</span>
                </div>
              </div>
              
              <Button
                onClick={handleFileSelect}
                variant="outline"
                className="w-full h-16 gap-3 text-base font-semibold"
              >
                <ImagePlus className="w-6 h-6" />
                {t('select_gallery')}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <img 
                src={photo} 
                alt={t('receipt_photo')} 
                className="w-full aspect-[4/3] object-cover rounded-2xl border-2 border-primary/30"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={handleRemovePhoto}
                  aria-label={t('retake_photo')}
                  className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <X className="w-6 h-6 text-destructive-foreground" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-2 bg-primary/90 backdrop-blur rounded-xl px-4 py-2">
                  <Check className="w-5 h-5 text-primary-foreground" />
                  <span className="text-sm font-semibold text-primary-foreground">{t('capture')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Receiver Info */}
        <div className="glass-card rounded-2xl p-5 space-y-5">
          <h3 className="font-bold text-base flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            {t('receiver_data')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block font-medium">
                {t('receiver_name')} *
              </label>
              <Input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder={t('receiver_name')}
                className="bg-secondary border-0 h-14 text-base"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block font-medium">
                {t('receiver_document')} ({t('optional')})
              </label>
              <Input
                value={receiverDoc}
                onChange={(e) => setReceiverDoc(e.target.value)}
                placeholder={t('receiver_document')}
                className="bg-secondary border-0 h-14 text-base"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card rounded-2xl p-5 space-y-5">
          <h3 className="font-bold text-base flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            {t('delivery_notes')}
          </h3>
          
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notes_placeholder')}
            className="bg-secondary border-0 min-h-[120px] resize-none text-base"
          />
        </div>

        {/* Delivery Summary */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold text-base flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-accent" />
            {t('delivery_summary')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground text-base">{t('invoice')}</span>
              <span className="font-semibold text-base">{delivery.nf}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-border/50">
              <span className="text-muted-foreground text-base">{t('client')}</span>
              <span className="font-semibold text-base">{delivery.client}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-border/50">
              <span className="text-muted-foreground text-base">{t('total_items')}</span>
              <span className="font-semibold text-base">{delivery.items}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-t border-border/50">
              <span className="text-muted-foreground text-base">{t('address')}</span>
              <span className="font-semibold text-base text-right max-w-[200px]">{delivery.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="floating-action">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full touch-action-btn bg-primary hover:bg-primary/90 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              {t('loading_camera')}
            </>
          ) : (
            <>
              <Check className="w-6 h-6 mr-3" />
              {t('save_receipt')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
