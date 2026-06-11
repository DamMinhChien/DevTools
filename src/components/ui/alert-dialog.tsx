import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "./button";

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  danger = true,
  confirmDisabled = false,
  confirmLoading = false,
  onConfirm,
  children,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={danger ? "text-red-600 font-bold" : "font-bold"}>{title}</DialogTitle>
          {description && <DialogDescription className="text-slate-500">{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={confirmLoading} className="rounded-xl">{cancelLabel}</Button>
          </DialogClose>
          <Button
            variant={danger ? "destructive" : "default"}
            onClick={onConfirm}
            autoFocus
            disabled={confirmDisabled || confirmLoading}
            className="rounded-xl min-w-[100px]"
          >
            {confirmLoading ? (
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                 <span>Đang xử lý...</span>
               </div>
            ) : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

