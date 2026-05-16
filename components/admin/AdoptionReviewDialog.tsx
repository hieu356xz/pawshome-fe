"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AdoptionRequest, AdoptionRequestStatus } from "@/types/adoption";
import { adoptionService } from "@/services/adoption.service";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  X,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFormTextArea } from "./form/AdminFormTextArea";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { cn } from "@/lib/utils";

interface AdoptionReviewDialogProps {
  request: AdoptionRequest;
  onSuccess: () => void;
  onClose: () => void;
}

enum RejectionReason {
  NOT_ENOUGH_EXPERIENCE = "NOT_ENOUGH_EXPERIENCE",
  INSUFFICIENT_LIVING_SPACE = "INSUFFICIENT_LIVING_SPACE",
  NO_YARD_FOR_PET = "NO_YARD_FOR_PET",
  FINANCIAL_UNSTABLE = "FINANCIAL_UNSTABLE",
  COMMITMENT_QUESTIONS = "COMMITMENT_QUESTIONS",
  OTHER_PETS_INCOMPATIBLE = "OTHER_PETS_INCOMPATIBLE",
  PET_ALREADY_ADOPTED = "PET_ALREADY_ADOPTED",
  INCOMPLETE_APPLICATION = "INCOMPLETE_APPLICATION",
  OTHER_REQUEST_APPROVED = "OTHER_REQUEST_APPROVED",
}

export function AdoptionReviewDialog({
  request,
  onSuccess,
  onClose,
}: AdoptionReviewDialogProps) {
  const t = useTranslations("AdoptionManagement");
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState<"approve" | "reject" | null>(
    null,
  );

  const [formData, setFormData] = useState({
    rejectionReason: RejectionReason.INCOMPLETE_APPLICATION,
    rejectionNote: "",
    approvalMessage:
      "Congratulations! Your adoption request has been approved. We will contact you soon for the next steps.",
    notes: "", // Internal notes
  });

  const handleReview = async (status: AdoptionRequestStatus) => {
    setIsLoading(true);
    try {
      const payload: any = { status };

      if (status === AdoptionRequestStatus.REJECTED) {
        payload.rejectionReason = formData.rejectionReason;
        payload.rejectionNote = formData.rejectionNote;
      } else {
        payload.approvalMessage = formData.approvalMessage;
      }

      await adoptionService.reviewRequest(request.petId, request.id, payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Review failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("reviewRequest")}
            </h2>
            <p className="text-gray-500 text-sm">
              {request.applicantName} for {request.pet?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* Applicant Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t("reason")}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                "{request.reason}"
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t("experience")}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                "{request.experience || "No experience mentioned."}"
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t("livingSituation")}
            </span>
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 text-sm text-orange-900 font-medium">
              {request.livingSituation}
            </div>
          </div>

          {/* Decision Section */}
          {!reviewMode ? (
            <div className="grid grid-cols-2 gap-4 py-4">
              <button
                onClick={() => setReviewMode("reject")}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-red-50 bg-red-50/20 text-red-600 hover:bg-red-50 hover:border-red-100 transition-all gap-2">
                <XCircle size={32} />
                <span className="font-bold uppercase tracking-widest text-xs">
                  {t("reject")}
                </span>
              </button>
              <button
                onClick={() => setReviewMode("approve")}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-green-50 bg-green-50/20 text-green-600 hover:bg-green-50 hover:border-green-100 transition-all gap-2">
                <CheckCircle size={32} />
                <span className="font-bold uppercase tracking-widest text-xs">
                  {t("approve")}
                </span>
              </button>
            </div>
          ) : reviewMode === "reject" ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                <AlertTriangle size={18} />
                You are about to reject this request
              </div>

              <AdminFormSelect
                id="rejectionReason"
                label={t("rejectionReason")}
                options={Object.values(RejectionReason).map((reason) => ({
                  label: t(`RejectionReasons.${reason}`),
                  value: reason,
                }))}
                value={formData.rejectionReason}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rejectionReason: e.target.value as RejectionReason,
                  })
                }
              />

              <AdminFormTextArea
                id="rejectionNote"
                label={t("rejectionNote")}
                placeholder="Explain why the request was rejected (this will be seen by the applicant)..."
                value={formData.rejectionNote}
                onChange={(e) =>
                  setFormData({ ...formData, rejectionNote: e.target.value })
                }
              />

              <button
                onClick={() => setReviewMode(null)}
                className="text-xs text-gray-400 hover:text-gray-600 underline font-medium">
                Back to decisions
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-3 rounded-xl border border-green-100">
                <Heart size={18} fill="currentColor" />
                You are approving this request
              </div>

              <AdminFormTextArea
                id="approvalMessage"
                label={t("approvalMessage")}
                placeholder="Send a warm message to the new pet owner..."
                value={formData.approvalMessage}
                onChange={(e) =>
                  setFormData({ ...formData, approvalMessage: e.target.value })
                }
              />

              <button
                onClick={() => setReviewMode(null)}
                className="text-xs text-gray-400 hover:text-gray-600 underline font-medium">
                Back to decisions
              </button>
            </div>
          )}
        </div>

        <div className="p-8 bg-gray-50 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl text-gray-500 h-11">
            Cancel
          </Button>
          {reviewMode && (
            <Button
              onClick={() =>
                handleReview(
                  reviewMode === "approve"
                    ? AdoptionRequestStatus.APPROVED
                    : AdoptionRequestStatus.REJECTED,
                )
              }
              disabled={isLoading}
              className={cn(
                "rounded-xl text-white gap-2 shadow-lg h-11 px-8 transition-all",
                reviewMode === "approve"
                  ? "bg-green-500 hover:bg-green-600 shadow-green-100"
                  : "bg-red-500 hover:bg-red-600 shadow-red-100",
              )}>
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : reviewMode === "approve" ? (
                <CheckCircle size={18} />
              ) : (
                <XCircle size={18} />
              )}
              {reviewMode === "approve" ? t("approve") : t("reject")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
