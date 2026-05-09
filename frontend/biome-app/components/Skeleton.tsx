import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Single skeleton block — uses the global .skeleton CSS class for the shimmer animation */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton rounded-2xl",
        className
      )}
    />
  );
}

/** Skeleton for a bento stat card (icon + two lines) */
export function SkeletonStatCard() {
  return (
    <div className="bento-card flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

/** Skeleton for the AI insight rows */
export function SkeletonInsightRow() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-black/5">
      <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/** Skeleton for a weekly plan day card */
export function SkeletonDayCard() {
  return (
    <div className="p-5 rounded-3xl border border-black/5 space-y-3">
      <Skeleton className="h-5 w-12 rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-2/4" />
    </div>
  );
}

/** Skeleton for a recent action row */
export function SkeletonActionRow() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-black/5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

/** Skeleton for an AQI / sidebar stat card */
export function SkeletonAQICard() {
  return (
    <div className="bento-card space-y-4">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-16 w-24 mx-auto rounded-2xl" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

/** Skeleton for the profile card column */
export function SkeletonProfileCard() {
  return (
    <div className="bento-card flex flex-col items-center p-8 space-y-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-3 w-24" />
      <div className="w-full space-y-3 pt-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
