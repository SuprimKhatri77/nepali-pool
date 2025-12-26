
export default function JapanLanguageNote() {
  const pdfUrl = "/notes/japaneseNotes.pdf#toolbar=0"; // PDF path in public folder

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Japanese Language Notes for Students Applying to Japan
      </h1>

      {/* PDF Viewer */}
      <div className="w-full max-w-4xl h-[600px] mb-6 border rounded shadow overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          frameBorder="0"
          title="Japanese Notes"
          
        ></iframe>
      </div>

      {/* Download Button */} 
      {/* pay to download the pdf  */}
      {/* <a
        href={pdfUrl}
        download
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Download Notes PDF
      </a> */}
    </div>
  );
}
