import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Header
    'greeting': 'Olá,',
    'deliveries_today': 'Entregas de Hoje',
    'remaining_deliveries': 'entregas restantes',
    'notifications': 'Notificações',
    
    // Navigation
    'nav_deliveries': 'Entregas',
    'nav_receipt': 'Canhoto',
    'nav_occurrences': 'Ocorrências',
    'nav_profile': 'Perfil',
    
    // Delivery Card
    'priority': 'Prioritário',
    'items': 'itens',
    'status_pending': 'Pendente',
    'status_transit': 'Em Trânsito',
    'status_delivered': 'Entregue',
    'status_issue': 'Ocorrência',
    
    // Delivery Detail
    'delivery_details': 'Detalhes da Entrega',
    'invoice': 'Nota Fiscal',
    'client': 'Cliente',
    'address': 'Endereço',
    'scheduled_time': 'Horário Agendado',
    'total_items': 'Total de Itens',
    'navigate': 'Navegar',
    'call': 'Ligar',
    'start_route': 'Iniciar Rota',
    'register_receipt': 'Registrar Canhoto',
    'register_occurrence': 'Registrar Ocorrência',
    'back': 'Voltar',
    
    // Receipt Capture
    'receipt_capture': 'Captura de Canhoto',
    'delivery_summary': 'Resumo da Entrega',
    'receiver_data': 'Dados do Recebedor',
    'receiver_name': 'Nome do Recebedor',
    'receiver_document': 'Documento (CPF/RG)',
    'delivery_notes': 'Observações da Entrega',
    'notes_placeholder': 'Adicione observações sobre a entrega...',
    'receipt_photo': 'Foto do Canhoto',
    'take_photo': 'Tirar Foto',
    'retake_photo': 'Tirar Novamente',
    'select_gallery': 'Selecionar da Galeria',
    'save_receipt': 'Salvar Canhoto',
    'camera_permission': 'Permissão de câmera necessária',
    'camera_permission_desc': 'Clique em "Tirar Foto" para solicitar acesso à câmera',
    'loading_camera': 'Carregando câmera...',
    'camera_ready': 'Câmera pronta',
    'capture': 'Capturar',
    'cancel': 'Cancelar',
    
    // Occurrence Form
    'occurrence_report': 'Registro de Ocorrência',
    'occurrence_type': 'Tipo de Ocorrência',
    'select_type': 'Selecione o tipo',
    'damaged_product': 'Produto Danificado',
    'refused_receipt': 'Recusa de Recebimento',
    'absent_customer': 'Cliente Ausente',
    'wrong_address': 'Endereço Incorreto',
    'closed_location': 'Local Fechado',
    'other': 'Outro',
    'description': 'Descrição',
    'describe_occurrence': 'Descreva detalhadamente a ocorrência...',
    'occurrence_photo': 'Foto da Ocorrência',
    'optional': 'opcional',
    'submit_occurrence': 'Enviar Ocorrência',
    
    // Accessibility
    'accessibility': 'Acessibilidade',
    'font_size': 'Tamanho da Fonte',
    'small': 'Pequeno',
    'medium': 'Médio',
    'large': 'Grande',
    'high_contrast': 'Alto Contraste',
    'language': 'Idioma',
    'close': 'Fechar',
  },
  en: {
    // Header
    'greeting': 'Hello,',
    'deliveries_today': "Today's Deliveries",
    'remaining_deliveries': 'remaining deliveries',
    'notifications': 'Notifications',
    
    // Navigation
    'nav_deliveries': 'Deliveries',
    'nav_receipt': 'Receipt',
    'nav_occurrences': 'Issues',
    'nav_profile': 'Profile',
    
    // Delivery Card
    'priority': 'Priority',
    'items': 'items',
    'status_pending': 'Pending',
    'status_transit': 'In Transit',
    'status_delivered': 'Delivered',
    'status_issue': 'Issue',
    
    // Delivery Detail
    'delivery_details': 'Delivery Details',
    'invoice': 'Invoice',
    'client': 'Client',
    'address': 'Address',
    'scheduled_time': 'Scheduled Time',
    'total_items': 'Total Items',
    'navigate': 'Navigate',
    'call': 'Call',
    'start_route': 'Start Route',
    'register_receipt': 'Register Receipt',
    'register_occurrence': 'Report Issue',
    'back': 'Back',
    
    // Receipt Capture
    'receipt_capture': 'Receipt Capture',
    'delivery_summary': 'Delivery Summary',
    'receiver_data': 'Receiver Data',
    'receiver_name': 'Receiver Name',
    'receiver_document': 'Document (ID)',
    'delivery_notes': 'Delivery Notes',
    'notes_placeholder': 'Add delivery notes...',
    'receipt_photo': 'Receipt Photo',
    'take_photo': 'Take Photo',
    'retake_photo': 'Retake Photo',
    'select_gallery': 'Select from Gallery',
    'save_receipt': 'Save Receipt',
    'camera_permission': 'Camera permission required',
    'camera_permission_desc': 'Click "Take Photo" to request camera access',
    'loading_camera': 'Loading camera...',
    'camera_ready': 'Camera ready',
    'capture': 'Capture',
    'cancel': 'Cancel',
    
    // Occurrence Form
    'occurrence_report': 'Issue Report',
    'occurrence_type': 'Issue Type',
    'select_type': 'Select type',
    'damaged_product': 'Damaged Product',
    'refused_receipt': 'Receipt Refused',
    'absent_customer': 'Customer Absent',
    'wrong_address': 'Wrong Address',
    'closed_location': 'Location Closed',
    'other': 'Other',
    'description': 'Description',
    'describe_occurrence': 'Describe the issue in detail...',
    'occurrence_photo': 'Issue Photo',
    'optional': 'optional',
    'submit_occurrence': 'Submit Issue',
    
    // Accessibility
    'accessibility': 'Accessibility',
    'font_size': 'Font Size',
    'small': 'Small',
    'medium': 'Medium',
    'large': 'Large',
    'high_contrast': 'High Contrast',
    'language': 'Language',
    'close': 'Close',
  },
  es: {
    // Header
    'greeting': 'Hola,',
    'deliveries_today': 'Entregas de Hoy',
    'remaining_deliveries': 'entregas restantes',
    'notifications': 'Notificaciones',
    
    // Navigation
    'nav_deliveries': 'Entregas',
    'nav_receipt': 'Recibo',
    'nav_occurrences': 'Incidencias',
    'nav_profile': 'Perfil',
    
    // Delivery Card
    'priority': 'Prioritario',
    'items': 'artículos',
    'status_pending': 'Pendiente',
    'status_transit': 'En Tránsito',
    'status_delivered': 'Entregado',
    'status_issue': 'Incidencia',
    
    // Delivery Detail
    'delivery_details': 'Detalles de Entrega',
    'invoice': 'Factura',
    'client': 'Cliente',
    'address': 'Dirección',
    'scheduled_time': 'Hora Programada',
    'total_items': 'Total de Artículos',
    'navigate': 'Navegar',
    'call': 'Llamar',
    'start_route': 'Iniciar Ruta',
    'register_receipt': 'Registrar Recibo',
    'register_occurrence': 'Registrar Incidencia',
    'back': 'Volver',
    
    // Receipt Capture
    'receipt_capture': 'Captura de Recibo',
    'delivery_summary': 'Resumen de Entrega',
    'receiver_data': 'Datos del Receptor',
    'receiver_name': 'Nombre del Receptor',
    'receiver_document': 'Documento (DNI)',
    'delivery_notes': 'Notas de Entrega',
    'notes_placeholder': 'Agregar notas sobre la entrega...',
    'receipt_photo': 'Foto del Recibo',
    'take_photo': 'Tomar Foto',
    'retake_photo': 'Tomar de Nuevo',
    'select_gallery': 'Seleccionar de Galería',
    'save_receipt': 'Guardar Recibo',
    'camera_permission': 'Permiso de cámara requerido',
    'camera_permission_desc': 'Haga clic en "Tomar Foto" para solicitar acceso',
    'loading_camera': 'Cargando cámara...',
    'camera_ready': 'Cámara lista',
    'capture': 'Capturar',
    'cancel': 'Cancelar',
    
    // Occurrence Form
    'occurrence_report': 'Registro de Incidencia',
    'occurrence_type': 'Tipo de Incidencia',
    'select_type': 'Seleccione tipo',
    'damaged_product': 'Producto Dañado',
    'refused_receipt': 'Rechazo de Recepción',
    'absent_customer': 'Cliente Ausente',
    'wrong_address': 'Dirección Incorrecta',
    'closed_location': 'Local Cerrado',
    'other': 'Otro',
    'description': 'Descripción',
    'describe_occurrence': 'Describa detalladamente la incidencia...',
    'occurrence_photo': 'Foto de Incidencia',
    'optional': 'opcional',
    'submit_occurrence': 'Enviar Incidencia',
    
    // Accessibility
    'accessibility': 'Accesibilidad',
    'font_size': 'Tamaño de Fuente',
    'small': 'Pequeño',
    'medium': 'Mediano',
    'large': 'Grande',
    'high_contrast': 'Alto Contraste',
    'language': 'Idioma',
    'close': 'Cerrar',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
