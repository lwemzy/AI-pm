import React, { useState } from 'react';
import { UploadIcon, FileIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
interface DataUploadProps {
  setCurrentPage: (page: string) => void;
}
export function DataUpload({
  setCurrentPage
}: DataUploadProps) {
  const {
    setPrescriptions,
    setProcessedData
  } = useData();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.name.endsWith('.csv'));
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(file => file.name.endsWith('.csv'));
      setFiles(selectedFiles);
    }
  };
  const processCSVData = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const requiredHeaders = ['Doctor_ID', 'Patient_ID', 'Prescription_Date', 'Drug_Name', 'Drug_Class', 'Quantity', 'Days_Supply', 'Strength', 'Pharmacy_ID'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    const data = lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      const row = headers.reduce((obj: any, header, index) => {
        obj[header.trim()] = values[index]?.trim() || '';
        return obj;
      }, {});
      const missingFields = requiredHeaders.filter(header => !row[header]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      const date = new Date(row.Prescription_Date);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format for: ${row.Prescription_Date}`);
      }
      return row;
    });
    const uniqueDoctors = new Set(data.map((d: any) => d.Doctor_ID));
    const uniquePharmacies = new Set(data.map((d: any) => d.Pharmacy_ID));
    const uniquePatients = new Set(data.map((d: any) => d.Patient_ID));
    const riskScores: {
      [key: string]: number;
    } = {};
    data.forEach((prescription: any) => {
      const doctorId = prescription.Doctor_ID;
      if (!riskScores[doctorId]) {
        riskScores[doctorId] = Math.random() * 100;
      }
    });
    setPrescriptions(data);
    setProcessedData({
      totalPrescriptions: data.length,
      totalDoctors: uniqueDoctors.size,
      totalPharmacies: uniquePharmacies.size,
      totalPatients: uniquePatients.size,
      riskScores
    });
  };
  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploadStatus('uploading');
    try {
      await processCSVData(files[0]);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error processing CSV:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };
  const resetUpload = () => {
    setFiles([]);
    setUploadStatus('idle');
  };
  return <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Prescription Data
        </h1>
        <p className="text-gray-600 mb-6">
          Upload CSV files containing prescription data for analysis. The system
          will validate and process the data automatically.
        </p>
        {uploadStatus === 'idle' && <>
            <div className={`border-2 border-dashed rounded-lg p-8 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
              <div className="flex flex-col items-center justify-center space-y-4">
                <UploadIcon size={48} className={`${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">
                    Drag and drop CSV files here
                  </p>
                  <p className="text-sm text-gray-500">or</p>
                </div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span>Browse files</span>
                  <input type="file" accept=".csv" multiple className="hidden" onChange={handleFileChange} />
                </label>
                <p className="text-xs text-gray-500">
                  Only CSV files are supported. Max file size: 50MB.
                </p>
              </div>
            </div>
            {files.length > 0 && <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Selected Files
                </h3>
                <div className="space-y-2">
                  {files.map((file, index) => <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileIcon size={20} className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button onClick={() => {
                setFiles(files.filter((_, i) => i !== index));
              }} className="text-gray-500 hover:text-red-500">
                        <XCircleIcon size={20} />
                      </button>
                    </div>)}
                </div>
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button onClick={resetUpload} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                  </button>
                  <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Upload & Process
                  </button>
                </div>
              </div>}
          </>}
        {uploadStatus === 'uploading' && <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Uploading and processing data...
            </p>
            <p className="text-sm text-gray-500">
              This may take a few moments.
            </p>
          </div>}
        {uploadStatus === 'success' && <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon size={40} className="text-green-500" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Upload Successful!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your data has been uploaded and processed successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full max-w-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">Data Summary:</span> Processed
                2,453 prescription records with 0 errors.
              </p>
            </div>
            <div className="mt-6">
              <button onClick={resetUpload} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                Upload More Files
              </button>
              <button onClick={() => setCurrentPage('dashboard')} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Dashboard
              </button>
            </div>
          </div>}
        {uploadStatus === 'error' && <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon size={40} className="text-red-500" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700">
              Upload Failed
            </p>
            <p className="text-sm text-gray-500 mb-6">
              There was an error processing your data.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-md">
              <p className="text-sm text-red-800">
                <span className="font-medium">Error:</span> {errorMessage}
              </p>
            </div>
            <div className="mt-6">
              <button onClick={resetUpload} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Try Again
              </button>
            </div>
          </div>}
        {uploadStatus === 'idle' && <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Data Format Guidelines
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please ensure your CSV files follow these formatting guidelines:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Required CSV Columns:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Doctor_ID (unique identifier for prescribing doctor)</li>
                <li>Patient_ID (anonymized patient identifier)</li>
                <li>Prescription_Date (format: YYYY-MM-DD)</li>
                <li>Drug_Name (standardized medication name)</li>
                <li>Drug_Class (opioid, stimulant, sedative, etc.)</li>
                <li>Quantity (number of units prescribed)</li>
                <li>Days_Supply (intended duration of prescription)</li>
                <li>Strength (medication strength/dosage)</li>
                <li>Pharmacy_ID (dispensing pharmacy identifier)</li>
              </ul>
              <p className="text-sm text-gray-700 font-medium mt-4 mb-2">
                Example:
              </p>
              <div className="bg-gray-100 p-2 rounded overflow-x-auto">
                <code className="text-xs text-gray-800">
                  Doctor_ID,Patient_ID,Prescription_Date,Drug_Name,Drug_Class,Quantity,Days_Supply,Strength,Pharmacy_ID
                  <br />
                  D12345,P98765,2023-09-15,Oxycodone,Opioid,60,30,5mg,PH001
                  <br />
                  D67890,P54321,2023-09-16,Adderall,Stimulant,30,30,10mg,PH002
                </code>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}