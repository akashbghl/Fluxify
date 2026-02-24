"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { Verified } from "lucide-react";
import { button, span } from "framer-motion/client";

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
  const [message, setMessage] = useState("");

  /* ============================
      Load Current Settings
  ============================ */

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setOrganizationName(user.organizationName || "");
    setOrganizationLogo(user.organizationLogo || "");
    setLogoPreview(user.organizationLogo || "");
  }, [user]);

  /* ============================
      Update Profile + Branding
  ============================ */

  const handleProfileSave = async () => {
    setSavingProfile(true);
    setMessage("");

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

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessage("✅ Profile updated successfully");
      await refreshUser(); // 🔄 Update sidebar/navbar branding
    } catch (err: any) {
      setMessage("❌ Failed to update profile");
      console.log("Error Message: ", err);
    } finally {
      setSavingProfile(false);
    }
  };

  /* ============================
      Change Password
  ============================ */

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      return alert("Fill both password fields");
    }

    setSavingPassword(true);
    setMessage("");

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

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMessage("🔐 Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.message || "❌ Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  /* ============================
      Logo Preview
  ============================ */

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrganizationLogo(value);
    setLogoPreview(value);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl space-y-6">
        <h1 className="text-xl font-semibold">Settings</h1>

        {/* Status Message */}
        {message && (
          <div className="rounded-md border bg-gray-50 px-4 py-2 text-sm">
            {message}
          </div>
        )}

        {/* ================= PROFILE ================= */}
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold">
            Profile & Organization
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              value={email}
              disabled
            />

            <Input
              label="Organization Name"
              value={organizationName}
              onChange={(e) =>
                setOrganizationName(e.target.value)
              }
            />

            <Input
              label="Organization Logo URL"
              value={organizationLogo}
              onChange={handleLogoChange}
            />
          </div>
          
          {/* SUBSRIPTION PLAN  */}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Subscription Plan:{" "}
              <span>
                {user?.organizationSubscription === "PRO"?(
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    PRO
                    <Verified size={12} className="ml-1 text-green-800" />
                  </span>
                ):
                <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                  FREE
                </span>
                }
              </span>
              {user?.organizationSubscription === "FREE" && (
                <button className="ml-4 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                onClick={() => window.location.href="/dashboard/Subscription"}
                >Upgrade</button>
              )}
              {user?.organizationSubscription === "PRO" && user?.subscriptionExpiry && (
                <span className="ml-1 text-xs text-gray-500">
                  (Expires on {new Date(user.subscriptionExpiry).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
          {/* Logo Preview */}
          {logoPreview && (
            <div className="flex items-center gap-4 pt-2">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-14 w-14 rounded-md border object-cover"
              />
              <p className="text-xs text-gray-500">
                Logo Preview
              </p>
            </div>
          )}

          <Button
            onClick={handleProfileSave}
            loading={savingProfile}
          >
            Save Changes
          </Button>
        </div>

        {/* ================= PASSWORD ================= */}
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold">
            Change Password
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Current Password"
              type="password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            loading={savingPassword}
            variant="outline"
          >
            Update Password
          </Button>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-red-700">
            Danger Zone
          </h2>

          <p className="text-xs text-red-600">
            Logging out will remove your session from
            this device.
          </p>

          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
