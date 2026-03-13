import { LayoutGrid, List, Table } from "lucide-react";

type ViewType = "card" | "list" | "table";

interface ViewSwitcherProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  const tabs = [
    { value: "card" as ViewType, icon: LayoutGrid, label: "Card" },
    { value: "list" as ViewType, icon: List, label: "List" },
    { value: "table" as ViewType, icon: Table, label: "Table" },
  ];

  return (
    <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = view === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onViewChange(tab.value)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export type { ViewType };
