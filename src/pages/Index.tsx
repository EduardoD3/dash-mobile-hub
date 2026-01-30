import { useState } from "react";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { DeliveryCard } from "@/components/driver/DeliveryCard";
import { DeliveryDetail } from "@/components/driver/DeliveryDetail";
import { ReceiptCapture } from "@/components/driver/ReceiptCapture";
import { OccurrenceForm } from "@/components/driver/OccurrenceForm";
import { BottomNav } from "@/components/driver/BottomNav";
import { mockDeliveries } from "@/data/mockDeliveries";
import { Delivery } from "@/types/delivery";
import { Package, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

type View = 'list' | 'detail' | 'receipt' | 'occurrence';
type Tab = 'deliveries' | 'receipt' | 'occurrences' | 'profile';

type FilterType = 'all' | 'pending' | 'in_transit' | 'delivered' | 'issue';

const Index = () => {
  const [view, setView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState<Tab>('deliveries');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const completedDeliveries = mockDeliveries.filter(d => d.status === 'delivered').length;
  
  const filteredDeliveries = mockDeliveries.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const handleSelectDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'receipt' || view === 'occurrence') {
      setView('detail');
    } else {
      setView('list');
      setSelectedDelivery(null);
    }
  };

  const handleComplete = () => {
    setView('list');
    setSelectedDelivery(null);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'receipt') {
      // Select first pending delivery for receipt capture
      const pendingDelivery = mockDeliveries.find(d => d.status !== 'delivered');
      if (pendingDelivery) {
        setSelectedDelivery(pendingDelivery);
        setView('receipt');
      }
    } else if (tab === 'occurrences') {
      const pendingDelivery = mockDeliveries.find(d => d.status !== 'delivered');
      if (pendingDelivery) {
        setSelectedDelivery(pendingDelivery);
        setView('occurrence');
      }
    } else if (tab === 'deliveries') {
      setView('list');
      setSelectedDelivery(null);
    }
  };

  // Render different views
  if (view === 'detail' && selectedDelivery) {
    return (
      <DeliveryDetail
        delivery={selectedDelivery}
        onBack={handleBack}
        onRegisterReceipt={() => setView('receipt')}
        onRegisterOccurrence={() => setView('occurrence')}
      />
    );
  }

  if (view === 'receipt' && selectedDelivery) {
    return (
      <ReceiptCapture
        delivery={selectedDelivery}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  if (view === 'occurrence' && selectedDelivery) {
    return (
      <OccurrenceForm
        delivery={selectedDelivery}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    );
  }

  const filterButtons: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todas', icon: <Package className="w-5 h-5" /> },
    { id: 'pending', label: 'Pendentes', icon: <Clock className="w-5 h-5" /> },
    { id: 'in_transit', label: 'Em Trânsito', icon: <Package className="w-5 h-5" /> },
    { id: 'delivered', label: 'Entregues', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'issue', label: 'Ocorrências', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <DriverHeader 
        driverName="Carlos Silva"
        totalDeliveries={mockDeliveries.length}
        completedDeliveries={completedDeliveries}
      />

      {/* Filter Pills */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {filterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              aria-pressed={filter === btn.id}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-base font-semibold transition-all min-h-[48px] ${
                filter === btn.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-secondary text-muted-foreground active:bg-secondary/80'
              }`}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery List */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base text-muted-foreground">
            {filteredDeliveries.length} entregas
          </h2>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground font-medium">Nenhuma entrega encontrada</p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onSelect={handleSelectDelivery}
            />
          ))
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
