import React from "react";
import { Card, CardContent } from "./ui/card";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
