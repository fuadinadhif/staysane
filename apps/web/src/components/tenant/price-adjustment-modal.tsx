"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DollarSign } from "lucide-react";
import { PriceAdjustmentForm } from "./price-adjustment-modal/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatIdr } from "./price-adjustment-modal/utils";
import { PriceAdjustmentList } from "./price-adjustment-modal/list";
import { toRequestPayload } from "./price-adjustment-modal/utils";
import type {
  FormData,
  PriceAdjustment,
  PriceAdjustmentModalProps,
} from "./price-adjustment-modal/types";
import { usePriceAdjustments } from "@/hooks/usePriceAdjustments";

export function PriceAdjustmentModal({
  open,
  onOpenChange,
  roomId,
  roomName,
  basePrice,
}: PriceAdjustmentModalProps) {
  const {
    priceAdjustments,
    loading,
    refetch,
    createPriceAdjustment,
    updatePriceAdjustment,
    deletePriceAdjustment,
  } = usePriceAdjustments(roomId);

  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PriceAdjustment | null>(null);

  const defaultForm: FormData = useMemo(
    () => ({
      title: "",
      startDate: undefined,
      endDate: undefined,
      adjustType: "PERCENTAGE",
      adjustValue: "",
      dateMode: "range",
      specificDates: [],
    }),
    []
  );

  useEffect(() => {
    if (open && roomId) refetch();
  }, [open, roomId, refetch]);

  const handleSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload = toRequestPayload({
        title: data.title,
        dateMode: data.dateMode,
        startDate: data.startDate,
        endDate: data.endDate,
        specificDates: data.specificDates,
        adjustType: data.adjustType,
        adjustValue: parseFloat(data.adjustValue),
      });

      if (editing) await updatePriceAdjustment(editing.id, payload);
      else await createPriceAdjustment(payload);

      setEditing(null);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (adjustment: PriceAdjustment) => {
    setEditing(adjustment);
    setShowForm(true);
  };

  const onCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (adjustmentId: string) => {
    setSubmitting(true);
    try {
      await deletePriceAdjustment(adjustmentId);
      if (editing?.id === adjustmentId) {
        setEditing(null);
        setShowForm(false);
      }
    } catch (err) {
      console.error("handleDelete:", err);
      toast?.error?.("Failed to delete price adjustment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Price Adjustments - {roomName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Base Price</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatIdr(basePrice)}
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} disabled={showForm}>
                <Plus className="h-4 w-4 mr-2" /> Add Price Adjustment
              </Button>
            </div>
          </div>

          {showForm && (
            <PriceAdjustmentForm
              basePrice={basePrice}
              title={
                editing ? "Edit Price Adjustment" : "Create Price Adjustment"
              }
              defaultData={
                editing
                  ? {
                      title: editing.title || "",
                      startDate: new Date(editing.startDate),
                      endDate: new Date(editing.endDate),
                      adjustType: editing.adjustType,
                      adjustValue: editing.adjustValue.toString(),
                      dateMode: editing.applyAllDates ? "range" : "specific",
                      specificDates:
                        editing.Dates?.map((d) => new Date(d.date)) || [],
                    }
                  : defaultForm
              }
              submitting={submitting}
              onCancel={onCancel}
              onSubmit={handleSubmit}
            />
          )}

          <PriceAdjustmentList
            basePrice={basePrice}
            loading={loading}
            items={priceAdjustments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PriceAdjustmentModal;
