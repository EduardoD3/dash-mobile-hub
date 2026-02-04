import { Package, Camera, AlertTriangle, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Tab = 'deliveries' | 'receipt' | 'occurrences' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'deliveries' as Tab, label: t('nav_deliveries'), icon: Package },
    { id: 'receipt' as Tab, label: t('nav_receipt'), icon: Camera },
    { id: 'occurrences' as Tab, label: t('nav_occurrences'), icon: AlertTriangle },
    { id: 'profile' as Tab, label: t('nav_profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 z-40" style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <div className="flex items-center justify-around py-3 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-1.5 py-3 px-5 rounded-2xl transition-all min-h-[64px] min-w-[72px] ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground active:bg-secondary'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <tab.icon className="w-7 h-7" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-xs font-semibold ${isActive ? 'text-primary' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
