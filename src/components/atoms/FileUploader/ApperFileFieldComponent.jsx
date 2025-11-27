import React, { useState, useRef, useEffect, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  // State for UI-driven values
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Refs for tracking lifecycle and preventing memory leaks
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementIdRef when elementId changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles || !Array.isArray(config.existingFiles)) {
      return [];
    }
    
    // Deep equality check for actual changes
    const currentFiles = config.existingFiles;
    const previousFiles = existingFilesRef.current;
    
    if (currentFiles.length !== previousFiles.length) {
      return currentFiles;
    }
    
    if (currentFiles.length === 0) {
      return [];
    }
    
    // Check first file's ID/id to detect format changes
    const currentFirstId = currentFiles[0]?.Id || currentFiles[0]?.id;
    const previousFirstId = previousFiles[0]?.Id || previousFiles[0]?.id;
    
    if (currentFirstId !== previousFirstId) {
      return currentFiles;
    }
    
    return previousFiles;
  }, [config.existingFiles]);

  // Initial Mount Effect
  useEffect(() => {
    let isMounted = true;
    
    const initializeSDK = async () => {
      try {
        // Initialize ApperSDK with timeout
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }
        
        if (!isMounted) return;
        
        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });
        
        if (isMounted) {
          mountedRef.current = true;
          existingFilesRef.current = memoizedExistingFiles;
          setIsReady(true);
          setError(null);
        }
        
      } catch (err) {
        console.error('ApperFileFieldComponent mount error:', err);
        if (isMounted) {
          setError(err.message);
          setIsReady(false);
        }
      }
    };
    
    initializeSDK();
    
    // Cleanup on component destruction
    return () => {
      isMounted = false;
      if (mountedRef.current && window.ApperSDK) {
        try {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        } catch (err) {
          console.error('ApperFileFieldComponent unmount error:', err);
        }
      }
      mountedRef.current = false;
      existingFilesRef.current = [];
      setIsReady(false);
      setError(null);
    };
  }, [elementId, config.fieldName, config.tableName, config.apperProjectId, config.apperPublicKey]);

  // File Update Effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) {
      return;
    }
    
    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Deep equality check with JSON.stringify
      const currentFilesStr = JSON.stringify(memoizedExistingFiles);
      const previousFilesStr = JSON.stringify(existingFilesRef.current);
      
      if (currentFilesStr === previousFilesStr) {
        return;
      }
      
      // Format detection: check for .Id vs .id property
      let filesToUpdate = memoizedExistingFiles;
      
      if (memoizedExistingFiles.length > 0) {
        const hasIdProperty = memoizedExistingFiles[0].hasOwnProperty('Id');
        const hasIdLowerProperty = memoizedExistingFiles[0].hasOwnProperty('id');
        
        // Convert format if needed using toUIFormat()
        if (hasIdProperty && !hasIdLowerProperty) {
          filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
        }
      }
      
      // Conditional: updateFiles if length > 0, clearField if empty
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
      
    } catch (err) {
      console.error('ApperFileFieldComponent update error:', err);
      setError(err.message);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI: Show if error state exists
  if (error) {
    return (
      <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
        <div className="text-red-600 font-medium mb-2">File Upload Error</div>
        <div className="text-sm text-red-500 mb-3">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setIsReady(false);
          }}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main container: Always render with unique ID */}
      <div 
        id={`file-uploader-${elementId}`}
        className="min-h-[120px] border-2 border-dashed border-gray-300 rounded-lg"
      >
        {/* Loading UI: Show when !isReady */}
        {!isReady && (
          <div className="flex items-center justify-center h-[120px] text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="ml-2 text-sm">Loading file uploader...</span>
          </div>
        )}
        {/* When mounted: SDK takes over container */}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;