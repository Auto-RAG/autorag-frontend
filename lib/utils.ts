import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "in_progress":
      return "text-blue-500";
    case "failed":
      return "text-red-500";
    case "terminated":
      return "text-orange-500";
    case "not_started":
      return "text-gray-400";
    default:
      return "text-gray-500";
  }
};

export function formatLocalTime(utcTimeStr: string) {
  const date = new Date(utcTimeStr);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });
}

export async function uploadFiles(projectId: string, files: FileList, successCallback: () => void, errorCallback: () => void) {
  if (!files) return;

    const formData = new FormData();
    
    // Append each selected file to the FormData object
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    const filenames = Array.from(files).map(file => file.name);

    formData.append('filenames', JSON.stringify(filenames));

    const options = {
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/upload`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      };
      
    try {
        const response = await axios.request(options);
        
        console.log(response.data);

        successCallback();
    } catch (error) {
        console.error(error);
        errorCallback();
    }
}
