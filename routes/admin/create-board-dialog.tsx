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
import { CreateBoardForm } from "./create-board-form";

export function CreateBoardDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Novo quadro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo quadro</DialogTitle>
          <DialogDescription>Depois de criado, adicione widgets de meta, funil ou métrica livre no editor do quadro.</DialogDescription>
        </DialogHeader>
        <CreateBoardForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
