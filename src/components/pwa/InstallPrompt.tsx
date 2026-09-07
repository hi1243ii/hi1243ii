"use client";

import * as React from "react";
import { Download, HardHat, Share, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's non-standard flag for "launched from home screen"
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function wasRecentlyDismissed() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_FOR_MS;
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable (private mode, etc.) — banner just won't be remembered
  }
}

export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [platform, setPlatform] = React.useState<"android" | "ios" | null>(null);

  React.useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setPlatform("android");
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // iOS Safari never fires beforeinstallprompt — offer manual instructions instead,
    // but only after the visitor has actually spent a moment on the site.
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isSafari = /safari/i.test(window.navigator.userAgent) && !/crios|fxios/i.test(window.navigator.userAgent);
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIos && isSafari) {
      iosTimer = setTimeout(() => {
        setPlatform("ios");
        setVisible(true);
      }, 15000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
    setVisible(false);
  }

  function handleDismiss() {
    dismiss();
    setVisible(false);
  }

  if (!visible || !platform) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-96">
      <Card className="flex items-start gap-3 border-primary/30 p-4 shadow-elevated">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <HardHat className="h-5 w-5" aria-hidden />
        </div>

        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-foreground">Install EquipRent</p>
          {platform === "android" ? (
            <>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Add it to your home screen for one-tap access and offline browsing.
              </p>
              <Button size="sm" className="mt-3" onClick={handleInstall}>
                <Download className="h-3.5 w-3.5" />
                Install
              </Button>
            </>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tap <Share className="mb-0.5 inline h-3 w-3" aria-hidden /> Share, then{" "}
              <span className="font-medium text-foreground">Add to Home Screen</span>.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
    </div>
  );
}
