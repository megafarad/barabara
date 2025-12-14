import { useState, useEffect } from "react";
import { Link } from "react-router";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-white text-zinc-900">
      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/60 backdrop-blur-2xl border-b border-zinc-900/5" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <Link to="/" className="text-2xl font-light tracking-[0.2em]">
            BARABARA
          </Link>
          <nav className="hidden md:flex items-center gap-12">
            {["Features", "Showcase"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm tracking-wide relative group transition-colors duration-300 text-zinc-600 hover:text-zinc-900">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-zinc-900 group-hover:w-full transition-all duration-500" />
              </a>
            ))}
          </nav>
          <Link to="/create-deck" className="px-7 py-2.5 rounded-full text-sm tracking-wide font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 hover:scale-105">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-blue-500/10" style={{ animation: "float 20s ease-in-out infinite" }} />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-violet-500/10" style={{ animation: "float 25s ease-in-out infinite reverse" }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl mb-12 bg-zinc-900/5 border-zinc-900/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm tracking-wide">Introducing Spaced Repetation Learning</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9] mb-8">
            Learn anything,
            <br />
            <span className="font-extralight italic text-zinc-600">remember everything</span>
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed mb-14 max-w-2xl mx-auto text-zinc-600">
              A focused flashcard platform built on spaced repetition science.
            <br />Private, elegant, and impossibly effective.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/dashboard" className="group px-9 py-4 rounded-full text-sm tracking-wide font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 hover:scale-105">
              <span className="flex items-center gap-2">
                Start Learning
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <a href="https://github.com/megafarad/barabara" className="px-9 py-4 rounded-full border text-sm tracking-wide font-medium backdrop-blur-xl border-zinc-900/10 hover:bg-zinc-900/5 transition-all duration-300 hover:scale-105">
              View Source
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
                { value: "Local-First", label: "No Accounts Needed" },
                { value: "Open Source", label: "MIT Licensed" },
                { value: "Offline-Ready", label: "Works Without Internet" }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl sm:text-2xl font-light tracking-tight mb-2 text-zinc-900 group-hover:text-zinc-700 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm tracking-wide uppercase text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full border backdrop-blur-xl mb-8 bg-white border-zinc-900/10">
              <span className="text-sm tracking-wide">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6">
              Built for serious learners
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Proven Spaced Repetition",
                desc: "Cards are scheduled using a simple, research-backed repetition system that prioritizes long-term retention.",
                img: "https://images.unsplash.com/photo-1701523600650-007b393ed2fe?q=80"
              },
              {
                title: "Complete Privacy",
                desc: "Zero data collection. Your data never leaves your device.",
                img: "https://images.unsplash.com/photo-1561474381-7a7ebb152e2c?q=80"
              },
             {
                title: "Browser-Only",
                desc: "Fully client-side. No servers, accounts, or network dependencies.",
                img: "https://images.unsplash.com/photo-1683322499436-f4383dd59f5a?q=80"
            }
            ,
              {
                title: "Open Architecture",
                desc: "Self-host, modify, or extend. Complete source access",
                img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80"
              },
              {
                title: "Instant Performance",
                desc: "Sub-100ms response times. Built for speed",
                img: "https://images.unsplash.com/photo-1762217975790-f919d61f7f92?q=80"
              },
              {
                title: "Refined Interface",
                desc: "Meticulously designed for distraction-free learning",
                img: "https://images.unsplash.com/photo-1633471908928-7ae447bbad7a?q=80"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-white">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={feature.img}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 opacity-90"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-light tracking-tight mb-3">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-6">
              Elegant simplicity
            </h2>
          </div>

          <div className="space-y-32">
            {[
              {
                title: "Create Collections",
                desc: "Organize knowledge with precision. Tag, categorize, and structure your learning path",
                img: "https://images.unsplash.com/photo-1728570136593-073b7b661742?q=80"
              },
              {
                title: "Intelligent Reviews",
                desc: "Cards appear exactly when needed. Our algorithm maximizes retention efficiency",
                img: "https://images.unsplash.com/photo-1717062010902-ff2a4671b34d?q=80"
              },
              {
                title: "Track Progress",
                desc: "Beautiful analytics reveal your learning patterns and mastery metrics",
                img: "https://images.unsplash.com/photo-1676911809746-85d90edbbe4a?q=80"
              }
            ].map((item, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 items-center`}>
                <div className="flex-1">
                  <div className="rounded-2xl overflow-hidden bg-zinc-50">
                    <img src={item.img} className="w-full" alt={item.title} />
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-light tracking-tight">{item.title}</h3>
                  <p className="text-lg leading-relaxed text-zinc-600">{item.desc}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-indigo-50">

        <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-center mb-20">
                On learning & memory
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                {
                    text: "If you wish to remember anything, you must actively retrieve it from memory rather than merely re-read it.",
                    author: "Henry L. Roediger III",
                    role: "Cognitive Psychologist (Testing Effect)",
                },
                {
                    text: "Repeated active recall is one of the most powerful learning strategies known in cognitive science.",
                    author: "John Dunlosky",
                    role: "Educational Psychologist",
                },
                {
                    text: "Flashcards, when used correctly, force the brain to practice recall — and that effort is what strengthens memory.",
                    author: "Barbara Oakley",
                    role: "Author, Learning How to Learn",
                },
                ].map((q, i) => (
                <div
                    key={i}
                    className="p-10 rounded-2xl bg-white transition-all duration-300 hover:scale-[1.02]"
                >
                    <p className="text-base leading-relaxed mb-8 italic text-zinc-700">
                    “{q.text}”
                    </p>
                    <div>
                    <div className="font-light tracking-tight mb-1">
                        {q.author}
                    </div>
                    <div className="text-sm tracking-wide text-zinc-400">
                        {q.role}
                    </div>
                    </div>
                </div>
                ))}
               </div>
            </div>
      </section>

      {/* CTA */}
      <section className="py-40 text-center">

        <div className="max-w-4xl mx-auto px-8">

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[0.9] mb-8">
            Begin your
            <br />
            <span className="font-extralight italic text-zinc-600">learning journey</span>
          </h2>
          <p className="text-lg mb-12 text-zinc-600">No registration required. Start immediately.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-base tracking-wide font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 hover:scale-105">
            Launch BaraBara
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900/5 py-16 bg-indigo-100/40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-bold tracking-[0.2em]">BARABARA</div>
            <div className="flex gap-12">
              {["GitHub"].map(link => (
                <a key={link} href="#" className="text-normal tracking-wide text-shadow-white hover:text-shadow-indigo-500 transition-colors">{link}</a>
              ))}
            </div>
          </div>
          <div className="text-center mt-12 text-sm tracking-wide text-zinc-400">
            © 2025 BaraBara. Open source and free forever.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default Home;
