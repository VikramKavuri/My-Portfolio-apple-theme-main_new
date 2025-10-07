import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Database, BarChart3, Cloud, Cpu, Upload, FileText, X, Loader2 } from 'lucide-react';

const API_BASE = 'https://my-portfolio-apple-theme-mainnew.vercel.app/api';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [jd, setJd] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // --- File handling (supports text-based files like .txt, .md, .json) ---
  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const handleFiles = async (files) => {
    setError('');
    const file = files?.[0];
    if (!file) return;

    // Basic guard: handle text-like types. (PDF/DOCX would need extra libs.)
    const textyTypes = [
      'text/plain', 'text/markdown', 'application/json', 'text/csv',
      'application/xml', 'text/xml'
    ];
    if (!textyTypes.includes(file.type) && !file.name.match(/\.(txt|md|csv|json|xml)$/i)) {
      setError('Please upload a text-based file (e.g., .txt, .md, .json, .csv).');
      return;
    }

    try {
      const text = await readFileAsText(file);
      setJd(text);
    } catch (e) {
      setError('Could not read the file. Please try again.');
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    await handleFiles(e.dataTransfer.files);
  };

  const onMatch = async () => {
    setLoading(true); setError(''); setResp(null);
    try {
      const r = await fetch(`${API_BASE}/match`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ job_description: jd })
      });
      if (!r.ok) throw new Error(`Server error (HTTP ${r.status})`);
      const data = await r.json();
      setResp(data);
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const clearJd = () => {
    setJd('');
    setResp(null);
    setError('');
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center px-4 sm:px-6 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >

        {/* Name & Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-5xl font-thin text-gray-900 mb-6 tracking-tight leading-tight">
            Thrivikrama Rao
          </h1>
          <h2 className="text-5xl font-light text-gray-900 mb-6 sm:mb-6">
            Data Enthusiastic
          </h2>
        </div>

        {/* Tagline */}
        <div className="mb-8 sm:mb-12">
          <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto">
            Transforming raw data into strategic insights with
            <span className="text-blue-600 font-medium"> 4+ years</span> of experience
            across Retail, Healthcare, and Finance domains
          </p>
        </div>

        {/* Tech Icons */}
        <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-10 max-w-sm sm:max-w-none mx-auto">
          {[
            { icon: Database, label: 'Data Pipelines' },
            { icon: BarChart3, label: 'Analytics' },
            { icon: Cloud, label: 'Cloud Platforms' },
            { icon: Cpu, label: 'AI & ML' }
          ].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center transition-all duration-700 transform ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-2 sm:mb-3 hover:shadow-xl transition-shadow duration-300">
                <item.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-700" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* === RAG Matcher Card === */}
        <div className="w-full max-w-4xl mx-auto text-left bg-white/70 backdrop-blur rounded-2xl shadow-xl border p-5 sm:p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl sm:text-2xl font-semibold">Instant JD Match (RAG)</h3>
            {!!jd && (
              <button
                onClick={clearJd}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
                title="Clear description"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Upload a text-based Job Description (or paste below), then click <span className="font-medium">Match Now</span>.
          </p>

          {/* Upload Zone + Buttons */}
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={onDrop}
            className={`rounded-2xl border-2 border-dashed p-5 transition ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white border flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="text-sm font-medium">Drag & drop a JD file here</div>
                  <div className="text-xs text-gray-500">.txt, .md, .json, .csv, .xml</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border hover:bg-gray-50 text-sm inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Choose file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.csv,.xml,text/plain,text/markdown,application/json,text/csv,application/xml,text/xml"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="mt-4">
            <label className="text-sm text-gray-700 mb-1 block">Or paste/edit the Job Description</label>
            <textarea
              className="w-full h-48 rounded-xl border p-3 focus:outline-none focus:ring bg-white"
              placeholder="Paste the JD here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
          </div>

          {/* Action */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onMatch}
              disabled={loading || !jd.trim()}
              className="px-5 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Scoring…' : 'Match Now'}
            </button>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>

          {/* Results */}
          {resp && (
            <div className="mt-7">
              {/* Keywords */}
              <h4 className="text-lg font-medium mb-2">Top 10 Keywords</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {resp.top_keywords?.map((k) => (
                  <span key={k} className="text-xs bg-gray-100 border rounded-full px-3 py-1">{k}</span>
                ))}
              </div>

              {/* Scores & Reasons */}
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(resp.results || {}).map(([resumeName, item]) => (
                  <div key={resumeName} className="border rounded-2xl p-5 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold">{resumeName.replace('_',' ').toUpperCase()}</h5>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{item.score}</div>
                        <div className="text-xs text-gray-500">Match Score / 100</div>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                      {item.reasons}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            View My Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 border-2 border-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Get In Touch
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToNext}
            className="animate-bounce text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>

      {/* Glass Morphism Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm"></div>
    </section>
  );
};

export default Hero;
