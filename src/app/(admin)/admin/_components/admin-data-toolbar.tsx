import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminDataToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
};

export function AdminDataToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Поиск...",
  filters,
}: AdminDataToolbarProps) {
  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="relative w-full max-w-lg">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 pr-9 pl-9"
          />

          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
              aria-label="Очистить поиск"
              onClick={() => onSearchChange("")}
            >
              <X />
            </Button>
          )}
        </div>

        {filters && (
          <div className="flex flex-wrap items-center gap-2 border-t pt-3">{filters}</div>
        )}
      </CardContent>
    </Card>
  );
}
