"use client"

import { useSearchParams } from "next/navigation";
import React, {useState, useEffect} from "react";
import {verifyTokenAndSignIn} from "@/app/lib/userActions";
import {useRouter} from "@/i18n/routing";
import {useTranslations} from "next-intl";

export default function Page() {
  const t = useTranslations("pages.verifyEmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // If token or email are missing, don't try verifying
    if (!token) {
      setError(t("invalidLink"));
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await verifyTokenAndSignIn(token);
        if (response.success) {
          setSuccess(t("successfulVerification"));
          router.push({pathname: "/", query: {refresh: "true"}});
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError(t("unexpectedError"));
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // If query parameters are missing, show a message.
  if (!token) {
    return (
      <div>
        <p>{t("invalidLink")}</p>
      </div>
    );
  }

  // Display loading state.
  if (loading) {
    return (
      <div>
        <p>{t("loadingVerification")}</p>
      </div>
    );
  }

  // Display error feedback.
  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  // Display success feedback.
  if (success) {
    return (
      <div>
        <p style={{ color: "green" }}>{success}</p>
      </div>
    );
  }

  return (
    <div>
      <p>{t("unexpectedError")}</p>
    </div>
  );
}
