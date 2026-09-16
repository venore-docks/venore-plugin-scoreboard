"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@venore/plugin-sdk/ui";
import { CreateGroupForm } from "./create-group-form";

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Novo curso/segmento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo curso/segmento</DialogTitle>
          <DialogDescription>Depois de criado, atribua a qualquer widget de meta ou funil, em qualquer quadro.</DialogDescription>
        </DialogHeader>
        <CreateGroupForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
