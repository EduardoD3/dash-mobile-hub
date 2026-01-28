import { Delivery } from "@/types/delivery";

export const mockDeliveries: Delivery[] = [
  {
    id: "1",
    nf: "NF-100001",
    client: "Construtora Horizonte",
    address: "Av. Paulista, 1000 - Bela Vista",
    city: "São Paulo, SP",
    items: 12,
    status: "pending",
    priority: "high",
    scheduledTime: "08:00",
    phone: "(11) 99999-0001",
    notes: "Vidros temperados 10mm - Cuidado redobrado",
  },
  {
    id: "2",
    nf: "NF-100002",
    client: "Vidraçaria Central",
    address: "Rua das Flores, 250 - Centro",
    city: "São Paulo, SP",
    items: 8,
    status: "pending",
    priority: "medium",
    scheduledTime: "09:30",
    phone: "(11) 99999-0002",
  },
  {
    id: "3",
    nf: "NF-100003",
    client: "Loja Cristal",
    address: "Av. Brasil, 500 - Jardins",
    city: "São Paulo, SP",
    items: 5,
    status: "in_transit",
    priority: "medium",
    scheduledTime: "10:00",
    phone: "(11) 99999-0003",
  },
  {
    id: "4",
    nf: "NF-100004",
    client: "Prédio Comercial Tower",
    address: "Rua Augusta, 1500 - Consolação",
    city: "São Paulo, SP",
    items: 20,
    status: "pending",
    priority: "high",
    scheduledTime: "11:00",
    phone: "(11) 99999-0004",
    notes: "Entrega no 15º andar - Agendar uso do elevador de carga",
  },
  {
    id: "5",
    nf: "NF-100005",
    client: "Shopping Center Goiânia",
    address: "Av. T-63, 1000 - Setor Bueno",
    city: "Goiânia, GO",
    items: 15,
    status: "delivered",
    priority: "low",
    scheduledTime: "07:00",
    phone: "(62) 99999-0005",
  },
  {
    id: "6",
    nf: "NF-100006",
    client: "Residencial Park",
    address: "Rua das Palmeiras, 100 - Alphaville",
    city: "Barueri, SP",
    items: 6,
    status: "issue",
    priority: "high",
    scheduledTime: "14:00",
    phone: "(11) 99999-0006",
    notes: "1 vidro com avaria detectada",
  },
];

export const getStatusLabel = (status: Delivery['status']): string => {
  const labels: Record<Delivery['status'], string> = {
    pending: 'Pendente',
    in_transit: 'Em Trânsito',
    delivered: 'Entregue',
    issue: 'Ocorrência',
    refused: 'Recusado',
  };
  return labels[status];
};

export const getStatusClass = (status: Delivery['status']): string => {
  const classes: Record<Delivery['status'], string> = {
    pending: 'status-pending',
    in_transit: 'status-transit',
    delivered: 'status-success',
    issue: 'status-danger',
    refused: 'status-danger',
  };
  return classes[status];
};
