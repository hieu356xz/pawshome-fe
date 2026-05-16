"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AdoptionRequest, AdoptionRequestStatus } from "@/types/adoption";
import { adoptionService } from "@/services/adoption.service";
import { toast } from "@/components/ui/toast";
import {
  CheckCircle,
  XCircle,
  Loader2,
  X,
  AlertTriangle,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Check,
  Info,
  History,
  PawPrint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminFormTextArea } from "./form/AdminFormTextArea";
import { AdminFormSelect } from "./form/AdminFormSelect";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  OTHER = "OTHER",
}

export function AdoptionReviewDialog({
  request,
  onSuccess,
  onClose,
}: AdoptionReviewDialogProps) {
  const t = useTranslations("AdoptionManagement");
  const tCommon = useTranslations("AdminCommon");
  const tPet = useTranslations("PetManagement");
  const [isLoading, setIsLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState<"approve" | "reject" | null>(
    null,
  );

  const [formData, setFormData] = useState({
    rejectionReason: RejectionReason.INCOMPLETE_APPLICATION,
    rejectionNote: "",
    approvalMessage: t("defaultApprovalMessage"),
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
      toast.success(t("statusUpdateSuccess"));
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Review failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = request.status === AdoptionRequestStatus.PENDING;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                request.status === AdoptionRequestStatus.APPROVED
                  ? "bg-green-50 text-green-600"
                  : request.status === AdoptionRequestStatus.REJECTED
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600",
              )}>
              {request.status === AdoptionRequestStatus.APPROVED ? (
                <CheckCircle size={24} />
              ) : request.status === AdoptionRequestStatus.REJECTED ? (
                <XCircle size={24} />
              ) : (
                <History size={24} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {t("reviewRequest")}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-500 text-sm font-medium">
                  {request.applicantName} <span className="mx-1">•</span>{" "}
                  {request.pet?.name}
                </span>
                <Badge
                  variant={
                    request.status === AdoptionRequestStatus.APPROVED
                      ? "success"
                      : request.status === AdoptionRequestStatus.REJECTED
                        ? "destructive"
                        : "warning"
                  }
                  className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {t(`AdoptionStatuses.${request.status}`)}
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all group">
            <X
              size={20}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Pet Information Card */}
          {request.pet && (
            <div className="mb-8 p-6 rounded-[2.5rem] bg-orange-50/20 border border-orange-100/50 flex flex-col md:flex-row gap-6 items-center md:items-stretch shadow-sm">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                {request.pet.images && request.pet.images.length > 0 ? (
                  <img
                    src={
                      request.pet.images.find((img) => img.isPrimary)
                        ?.imageUrl || request.pet.images[0].imageUrl
                    }
                    alt={request.pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500">
                    <PawPrint size={40} />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center text-center md:text-left space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {request.pet.name}
                    </h3>
                    <Badge
                      variant="orange"
                      className="rounded-full text-[10px] h-5 px-2">
                      {request.pet.petCode}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {request.pet.species?.name} <span className="mx-1">•</span>{" "}
                    {request.pet.breed?.name}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {tPet("gender")}
                    </span>
                    <span className="text-sm font-bold text-gray-700 capitalize">
                      {tPet(`Genders.${request.pet.gender}`)}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {tPet("ageGroup")}
                    </span>
                    <span className="text-sm font-bold text-gray-700 capitalize">
                      {tPet(`AgeGroups.${request.pet.ageGroup}`)}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {tPet("weight")}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {request.pet.weight
                        ? `${request.pet.weight} kg`
                        : tCommon("unknown")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:border-l border-orange-100 md:pl-8 flex flex-col justify-center items-center md:items-start gap-2">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  {tPet("status")}
                </span>
                <Badge
                  variant="warning"
                  className="rounded-full px-4 py-1 text-xs">
                  {tPet(`AdoptionStatuses.${request.pet.adoptionStatus}`)}
                </Badge>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Applicant & Contact */}
            <div className="space-y-8 lg:col-span-1">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <User size={14} className="text-orange-500" />
                  {t("personalInfo")}
                </h3>
                <div className="space-y-3 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {t("email")}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {request.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {t("phone")}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {request.phone || tCommon("unknown")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">
                        {t("address")}
                      </p>
                      <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                        {request.address || tCommon("unknown")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Home size={14} className="text-orange-500" />
                  {t("livingSituation")}
                </h3>
                <div className="space-y-4">
                  <div className="p-5 bg-orange-50/30 rounded-2xl border border-orange-100/50">
                    <p className="text-sm text-gray-700 font-medium italic leading-relaxed">
                      "{request.livingSituation}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={cn(
                        "p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-colors",
                        request.hasYard
                          ? "bg-green-50/50 border-green-100 text-green-700"
                          : "bg-gray-50 border-gray-100 text-gray-400",
                      )}>
                      <Check
                        size={16}
                        className={cn(!request.hasYard && "opacity-0")}
                      />
                      <span className="text-[10px] font-bold uppercase">
                        {t("hasYard")}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-colors",
                        request.hasOtherPets
                          ? "bg-blue-50/50 border-blue-100 text-blue-700"
                          : "bg-gray-50 border-gray-100 text-gray-400",
                      )}>
                      <Check
                        size={16}
                        className={cn(!request.hasOtherPets && "opacity-0")}
                      />
                      <span className="text-[10px] font-bold uppercase">
                        {t("hasOtherPets")}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Detailed Questions */}
            <div className="lg:col-span-2 space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Info size={14} className="text-orange-500" />
                  {t("survey")}
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("reason")}
                    </label>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {request.reason}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("experience")}
                    </label>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {request.experience || t("noExperience")}
                      </p>
                    </div>
                  </div>

                  {request.hasOtherPets && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {t("otherPetsDetail")}
                      </label>
                      <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50">
                        <p className="text-sm text-blue-900 leading-relaxed font-medium">
                          {request.otherPetsDetail}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("commitment")}
                    </label>
                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        {request.commitment || t("noCommitment")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Review History / Current Review Section */}
              {!isPending && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <History size={14} className="text-orange-500" />
                    {t("reviewResult")}
                  </h3>
                  <div
                    className={cn(
                      "p-8 rounded-[2.5rem] border-2 shadow-lg",
                      request.status === AdoptionRequestStatus.APPROVED
                        ? "bg-green-50/50 border-green-100 shadow-green-100/20"
                        : "bg-red-50/50 border-red-100 shadow-red-100/20",
                    )}>
                    {request.status === AdoptionRequestStatus.APPROVED ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-green-700">
                          <Heart size={24} fill="currentColor" />
                          <span className="text-xl font-bold">
                            {t("AdoptionStatuses.approved")}
                          </span>
                        </div>
                        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-green-100">
                          <p className="text-sm text-green-900 leading-relaxed italic font-medium">
                            "{request.approvalMessage || t("noApprovalMessage")}
                            "
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-700">
                          <XCircle size={24} />
                          <span className="text-xl font-bold">
                            {t("AdoptionStatuses.rejected")}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                              {t("rejectionReason")}:
                            </span>
                            <span className="text-sm font-bold text-red-700">
                              {request.rejectionReason
                                ? t(
                                    `RejectionReasons.${request.rejectionReason}`,
                                  )
                                : tCommon("unknown")}
                            </span>
                          </div>
                          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-red-100">
                            <p className="text-sm text-red-900 leading-relaxed italic font-medium">
                              "{request.rejectionNote || t("noRejectionNote")}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Review Input Area */}
              {isPending && (
                <div className="pt-4">
                  {!reviewMode ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setReviewMode("reject")}
                        className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-red-50 bg-red-50/20 text-red-600 hover:bg-red-50 hover:border-red-100 transition-all gap-3 group shadow-sm hover:shadow-md">
                        <XCircle
                          size={40}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="font-bold uppercase tracking-[0.2em] text-[10px]">
                          {t("reject")}
                        </span>
                      </button>
                      <button
                        onClick={() => setReviewMode("approve")}
                        className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-green-50 bg-green-50/20 text-green-600 hover:bg-green-50 hover:border-green-100 transition-all gap-3 group shadow-sm hover:shadow-md">
                        <Heart
                          size={40}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="font-bold uppercase tracking-[0.2em] text-[10px]">
                          {t("approve")}
                        </span>
                      </button>
                    </div>
                  ) : reviewMode === "reject" ? (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                      <div className="flex items-center gap-3 text-red-600 font-bold text-sm bg-red-50 p-4 rounded-[1.5rem] border border-red-100 shadow-inner">
                        <AlertTriangle size={20} />
                        {t("rejectWarning")}
                      </div>

                      <AdminFormSelect
                        id="rejectionReason"
                        label={t("rejectionReason")}
                        options={Object.values(RejectionReason).map(
                          (reason) => ({
                            label: t(`RejectionReasons.${reason}`),
                            value: reason,
                          }),
                        )}
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
                        placeholder={t("rejectionNotePlaceholder")}
                        value={formData.rejectionNote}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rejectionNote: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() => setReviewMode(null)}
                        className="text-[10px] text-gray-400 hover:text-gray-600 uppercase font-bold tracking-widest flex items-center gap-2 transition-colors">
                        <X size={14} />
                        {t("cancelDecision")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in slide-in-from-left-8 duration-500">
                      <div className="flex items-center gap-3 text-green-600 font-bold text-sm bg-green-50 p-4 rounded-[1.5rem] border border-green-100 shadow-inner">
                        <Heart size={20} fill="currentColor" />
                        {t("approveWarning")}
                      </div>

                      <AdminFormTextArea
                        id="approvalMessage"
                        label={t("approvalMessage")}
                        placeholder={t("approvalMessagePlaceholder")}
                        value={formData.approvalMessage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            approvalMessage: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() => setReviewMode(null)}
                        className="text-[10px] text-gray-400 hover:text-gray-600 uppercase font-bold tracking-widest flex items-center gap-2 transition-colors">
                        <X size={14} />
                        {t("cancelDecision")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Clock className="text-orange-400" size={14} />{" "}
                {t("pendingReview")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle
                  className={cn(
                    request.status === AdoptionRequestStatus.APPROVED
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                  size={14}
                />
                {t("processedOn")}{" "}
                {request.reviewedAt
                  ? new Date(request.reviewedAt).toLocaleDateString()
                  : new Date(request.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-2xl text-gray-500 h-12 px-6 hover:bg-white transition-all font-bold uppercase tracking-wider text-[10px]">
              {tCommon("cancel")}
            </Button>
            {isPending && reviewMode && (
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
                  "rounded-2xl text-white gap-3 shadow-xl h-12 px-10 transition-all font-bold uppercase tracking-widest text-[10px]",
                  reviewMode === "approve"
                    ? "bg-green-500 hover:bg-green-600 shadow-green-200"
                    : "bg-red-500 hover:bg-red-600 shadow-red-200",
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
    </div>
  );
}

// Helper to keep Clock icon imported
import { Clock } from "lucide-react";
