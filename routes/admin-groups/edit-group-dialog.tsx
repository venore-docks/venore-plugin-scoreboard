"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { EditGroupForm } from "./edit-group-form";

export function EditGroupDialog({ groupId, label, primeSegmentKey }: { groupId: string; label: string; primeSegmentKey: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Editar ${label}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar curso/segmento</DialogTitle>
        </DialogHeader>
        <EditGroupForm groupId={groupId} label={label} primeSegmentKey={primeSegmentKey} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
