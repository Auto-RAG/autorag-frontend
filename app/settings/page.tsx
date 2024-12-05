import { Metadata } from "next";

import ApiKeyView from "@/components/settings/ApiKeyView";
import HostSetting from "@/components/settings/host-setting";


export const metadata: Metadata = {
  title: "Settings | AutoRAG Cloud",
  description: "Manage your AutoRAG Cloud settings",
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Host Settings</h2>
              <div className="space-y-4">
                <HostSetting />
              </div>
            </div>

            {/* API Settings Section */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">API Settings</h2>
              <div className="space-y-4">
                <ApiKeyView />
              </div>
            </div>

            {/* Preferences Section */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                {/* Add preferences here */}
                <p className="text-gray-600">Preferences coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
