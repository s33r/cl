import React, { useState } from 'react';

type CSVImportProps = {
  onImportComplete: () => void;
};

/**
 * CSV Import component for uploading and importing events from CSV files
 */
export const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; updated: number; errors: string[] } | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  /**
   * CSV template with headers and example event
   */
  const csvTemplate = `id,title,description,financialCost,color,recurrence,dateType,year,isoWeek,dayOffset,month,day
,Team Meeting,Weekly team standup,0,#3498db,EveryWeek,iso,2025,1,0,,
,Project Deadline,Q1 deliverable deadline,5000,#e74c3c,None,normal,2025,,,3,31`;

  /**
   * Copies CSV template to clipboard
   */
  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(csvTemplate);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy template:', error);
    }
  };

  /**
   * Handles file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  /**
   * Handles CSV file upload and import
   */
  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/events/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import CSV');
      }

      const data = await response.json();
      setResult(data);

      if (data.success > 0 || data.updated > 0) {
        onImportComplete();
      }
    } catch (error) {
      setResult({
        success: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="csv-import">
      <h2>Import Events from CSV</h2>

      <div className="import-controls">
        <div className="file-input">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
        </div>
        <button
          onClick={handleImport}
          disabled={!file || importing}
          className="import-btn"
        >
          {importing ? 'Importing...' : 'Import CSV'}
        </button>
      </div>

      <div className="import-instructions">
        <h3>CSV Format</h3>
        <p>Your CSV file should have the following columns:</p>
        <ul>
          <li><strong>id</strong> (optional): UUID for updating existing events</li>
          <li><strong>title</strong>: Event title (required)</li>
          <li><strong>description</strong>: Event description</li>
          <li><strong>financialCost</strong>: Cost as a number</li>
          <li><strong>color</strong>: Hex color code (e.g., #3498db)</li>
          <li><strong>recurrence</strong>: None, EveryDay, EveryWeek, EveryMonth, EveryQuarter, EveryYear, Every2Years, Every3Years, Every5Years, Every10Years</li>
          <li><strong>dateType</strong>: iso or normal</li>
          <li><strong>year</strong>: Year number</li>
          <li><strong>isoWeek</strong>: ISO week number (1-53, for ISO dates)</li>
          <li><strong>dayOffset</strong>: Day offset (0-6, for ISO dates)</li>
          <li><strong>month</strong>: Month number (1-12, for normal dates)</li>
          <li><strong>day</strong>: Day number (1-31, for normal dates)</li>
        </ul>

        <div className="template-section">
          <p>Click the button below to copy a CSV template with headers and example events:</p>
          <button onClick={handleCopyTemplate} className="copy-template-btn">
            {copySuccess ? 'Copied!' : 'Copy CSV Template'}
          </button>
        </div>
      </div>

      {result && (
        <div className="import-result">
          <h3>Import Results</h3>
          <p className="success">Successfully created: {result.success} events</p>
          <p className="success">Successfully updated: {result.updated} events</p>
          {result.errors.length > 0 && (
            <div className="errors">
              <h4>Errors:</h4>
              <ul>
                {result.errors.map((error, index) => (
                  <li key={index} className="error">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
