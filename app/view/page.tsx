"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ViewPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [documentData, setDocumentData] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await fetch("/api/view", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setDocumentData(data);
      } catch (err: any) {
        setError("Failed to load document.");
        console.error("Error fetching document:", err);
      }
    };

    fetchDocument();
  }, [token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!documentData) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{documentData.name}</h1>

      {/* Render Excel Data */}
      {documentData.type === "xlsx" ? (
        Object.keys(documentData.content || {}).map((sheetName, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">📄 {sheetName}</h2>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {documentData.content[sheetName].map((row: any[], rowIndex: number) => (
                  <tr key={rowIndex} className="border border-gray-300">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 p-2">
                        {cell || "-"} {/* Handle empty cells */}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : documentData.type === "docx" ?  (
        <div>
          <p>{documentData.content}</p>
        </div>
      ) : (
        <div className="text-gray-700">Unsupported file type.</div>
      )}
    </div>
  );
}
