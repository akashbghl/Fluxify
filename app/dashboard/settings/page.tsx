"use client";

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import {
  Verified,
  Building2,
  UserRound,
  Lock,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type MessageTone = "success" | "error";

interface UiMessage {
  tone: MessageTone;
  text: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<UiMessage | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setOrganizationName(user.organizationName || "");
    setOrganizationLogo(user.organizationLogo || "");
    setLogoPreview(user.organizationLogo || "");
  }, [user]);

  const isProActive =
    user?.organizationSubscription === "PRO" && user.subscriptionStatus === "ACTIVE";

  const subscriptionExpiryText = useMemo(() => {
    if (!user?.subscriptionExpiry) return "N/A";
    return new Date(user.subscriptionExpiry).toLocaleDateString();
  }, [user?.subscriptionExpiry]);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          organizationName,
          organizationLogo,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!data.success) throw new Error(data.message || "Failed to update settings");

      setMessage({
        tone: "success",
        text: "Profile and organization details updated successfully.",
      });
      await refreshUser();
    } catch (error: unknown) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Failed to update profile."),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setMessage({
        tone: "error",
        text: "Please fill both password fields.",
      });
      return;
    }

    setSavingPassword(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!data.success) throw new Error(data.message || "Password update failed");

      setMessage({
        tone: "success",
        text: "Password updated successfully.",
      });
      setOldPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      setMessage({
        tone: "error",
        text: getErrorMessage(error, "Password update failed."),
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrganizationLogo(value);
    setLogoPreview(value);
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-50 to-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage your account, organization branding, and security in one place.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              <Sparkles size={13} className="text-amber-500" />
              Workspace Preferences
            </span>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <UserRound size={18} className="text-slate-700" />
                <h2 className="text-base font-semibold text-slate-900">Profile & Organization</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-300 focus:ring-slate-900"
                />
                <Input label="Email" value={email} disabled className="bg-slate-50 text-slate-500" />
                <Input
                  label="Organization Name"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="border-slate-300 focus:ring-slate-900"
                />
                <Input
                  label="Organization Logo URL"
                  value={organizationLogo}
                  onChange={handleLogoChange}
                  className="border-slate-300 focus:ring-slate-900"
                />
              </div>

              {logoPreview && (
                <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={logoPreview}
                    alt="Organization Logo Preview"
                    className="h-14 w-14 rounded-xl border border-slate-200 bg-white object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Logo Preview</p>
                    <p className="text-xs text-slate-500">Shown in sidebar and other workspace areas.</p>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <Button onClick={handleProfileSave} loading={savingProfile}>
                  Save Profile Changes
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <Lock size={18} className="text-slate-700" />
                <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Current Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="border-slate-300 focus:ring-slate-900"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-slate-300 focus:ring-slate-900"
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Use a strong password with at least 8 characters and a mix of letters, numbers,
                and symbols.
              </p>

              <div className="mt-5">
                <Button onClick={handlePasswordChange} loading={savingPassword} variant="outline">
                  Update Password
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">Subscription</h3>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Plan</p>
                  <div className="mt-1">
                    {user?.organizationSubscription === "PRO" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        PRO
                        <Verified size={12} />
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user?.subscriptionStatus === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : user?.subscriptionStatus === "EXPIRED"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {user?.subscriptionStatus || "N/A"}
                    </span>
                    <span className="text-xs text-slate-500">Expiry: {subscriptionExpiryText}</span>
                  </div>
                </div>

                {(user?.organizationSubscription === "FREE" || user?.subscriptionStatus === "EXPIRED") && (
                  <Button
                    onClick={() => {
                      window.location.href = "/dashboard/Subscription";
                    }}
                    className="w-full"
                  >
                    {user?.subscriptionStatus === "EXPIRED" ? "Renew Subscription" : "Upgrade to Pro"}
                  </Button>
                )}

                {isProActive && (
                  <p className="text-xs text-emerald-700">
                    Your PRO subscription is active and all premium features are enabled.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-700" />
                <h3 className="text-sm font-semibold text-rose-700">Danger Zone</h3>
              </div>
              <p className="mb-4 text-xs text-rose-600">
                Logging out will remove your active session from this device.
              </p>
              <Button variant="danger" onClick={logout} className="w-full">
                Logout
              </Button>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
