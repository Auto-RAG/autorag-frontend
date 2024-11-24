import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";


const handleFileChange = (projectId: string, 
    successCallback: () => void,
) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const formData = new FormData();
    
    // Append each selected file to the FormData object
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

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
        
        // Show success toast
        toast.success('Files uploaded successfully', {
            position: 'top-center',
            duration: 3000,
        });

        successCallback();
    } catch (error) {
        console.error(error);
        toast.error('Failed to upload files');
    }
  };


export function renderUploadFiles(projectId: string,
    filesUploadedCallback: () => void,
){
    return (
      <div className="grid w-full gap-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100" htmlFor="file-upload">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF Files Only (MAX. 100MB)</p>
            </div>
            <input
              multiple 
              accept=".pdf" 
              className="hidden" 
              id="file-upload"
              type="file"
              onChange={handleFileChange(projectId, filesUploadedCallback)}
            />
          </label>
        </div>
      </div>
    );
  }
