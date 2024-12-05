
export default function HostSetting() {
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL || '';

  return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="host-url">
            Host URL
          </label>
          <input
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
            id="host-url"
            type="text"
            value={hostUrl}
          />
        </div>
      </div>
  );
}
