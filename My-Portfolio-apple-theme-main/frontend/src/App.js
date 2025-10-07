import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <Testimonials />
      <Contact />
      <Footer />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* FIXED: Proper container structure */}
      <div className="w-full max-w-none mx-auto">
        <Header />
        
        {/* FIXED: Centered content container */}
        <main className="w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Hero />
            <Skills />
            <Experience />
            <Projects />
            <Certifications />
            <Testimonials />
            <Contact />
          </div>
        </main>
        
        {/* FIXED: Proper footer */}
        <footer className="w-full bg-gray-900 text-white py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>&copy; 2025 Vikram Kavuri. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
