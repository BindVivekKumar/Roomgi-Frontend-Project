import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  Linkedin,
  Mail,
  Terminal,
  Cpu,
  Code2,
  Rocket,
  Binary,
  ShieldCheck,
  Zap,
  ChevronRight,
  Library
} from "lucide-react";

import AbhinavImg from "../assets/AbhinavFinal.webp";
import AyushrajImg from "../assets/ayushraj.jpeg";

const CEO = () => {
  const leaders = useMemo(
    () => [
      {
        id: "ayush-raj",
        name: "Ayush Raj",
        role: "CEO",
        email: "ishu7209768984@gmail.com",
        degree: "B.Tech in Computer Science",
        img: AyushrajImg,
        quote: "Turning complex code into comfortable living spaces.",
        status: "Final Year Student",
        extra: "Leading Product Strategy & Market Expansion",
        linkedin: "https://www.linkedin.com/in/-backenddeveloper-ayush-raj/",
        bio: "Ayush is the chief architect behind RoomGi's vision. A full-stack developer at heart, he started RoomGi to bridge the gap between students and verified property owners using transparent tech solutions.",
        skills: [
          { icon: <Code2 size={14} />, label: "Full Stack Dev" },
          { icon: <Rocket size={14} />, label: "Product Vision" },
          { icon: <Terminal size={14} />, label: "System Design" }
        ]
      },
      {
        id: "abhinav-kumar",
        name: "Abhinav Kumar",
        role: "Director & Co-Founder",
        email: "kumabhi139@gmail.com",
        degree: "B.Tech in AIML",
        img: AbhinavImg,
        quote: "Intelligence is not just about data, it's about making lives easier.",
        status: "Final Year Student",
        extra: "Driving AI Automation & Data Security",
        linkedin: "https://www.linkedin.com/in/abhinav-kumar-863359319/",
        bio: "Specializing in Artificial Intelligence, Abhinav ensures RoomGi stays ahead of the curve. He leads the development of smart algorithms that detect fraudulent listings and provide personalized recommendations.",
        skills: [
          { icon: <Binary size={14} />, label: "AIML Models" },
          { icon: <ShieldCheck size={14} />, label: "Data Security" },
          { icon: <Cpu size={14} />, label: "Automation" }
        ]
      }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Helmet>
        <title>Leadership Team | RoomGi</title>
        <meta
          name="description"
          content="Meet the leadership team of RoomGi: Ayush Raj (CEO) and Abhinav Kumar (Director). Building the future of verified rentals with AI & scalable systems."
        />
        <meta name="keywords" content="RoomGi founders, Ayush Raj, Abhinav Kumar, startup leadership, AI rentals" />

        {/* Open Graph */}
        <meta property="og:title" content="Leadership Team | RoomGi" />
        <meta property="og:description" content="Meet the minds building RoomGi — scalable, AI-driven, secure rental platform." />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Leadership Team | RoomGi" />
        <meta name="twitter:description" content="The engineers behind RoomGi." />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RoomGi",
            founder: leaders.map((l) => ({
              "@type": "Person",
              name: l.name,
              jobTitle: l.role,
              alumniOf: l.college,
              sameAs: l.linkedin
            }))
          })}
        </script>
      </Helmet>

      {/* HERO */}
      <header className="pt-24 pb-16 px-6 bg-gradient-to-b from-green-50/50 to-white text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow border text-green-600 text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap size={12} /> Driven by Innovation
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            The Engineering <br />
            <span className="text-green-600">Powerhouse.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Merging <b>Software Architecture</b> with <b>Artificial Intelligence</b> to build the future of rentals.
          </p>
        </div>
      </header>

      {/* LEADERS */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {leaders.map((leader) => (
            <article key={leader.id} className="group flex flex-col">
              <div className="relative mb-8">
                <img
                  src={leader.img}
                  alt={leader.name}
                  loading="lazy"
                  className="rounded-[2rem] w-full h-[480px] object-cover shadow-lg transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all p-8 flex flex-col justify-end rounded-[2rem]">
                  <p className="text-white italic mb-4">"{leader.quote}"</p>
                  <div className="flex gap-3">
                    <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-500 rounded-xl text-white">
                      <Linkedin size={18} />
                    </a>
                    <a href={`mailto:${leader.email}`} className="p-3 bg-white/20 rounded-xl text-white">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black">{leader.name}</h2>
                <p className="text-green-600 text-xs font-bold uppercase tracking-widest mt-1">
                  {leader.role} • {leader.extra}
                </p>

                <p className="mt-4 text-slate-600">{leader.bio}</p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {leader.skills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-2 bg-slate-50 border px-3 py-1 rounded-xl text-xs font-semibold">
                      {skill.icon}
                      {skill.label}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ABES SECTION */}
        <section className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-4xl font-black mb-4">
                From Labs to <span className="text-green-400">Industry</span>
              </h3>
              <p className="text-slate-300">
                As final year students at <b>ABES Engineering College</b>, we build scalable, real-world systems.
              </p>
              <button className="mt-6 flex items-center gap-2 font-black uppercase text-xs">
                Learn More <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["2026", "AIML", "CSE", "100%"].map((val, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-2xl">
                  <p className="text-3xl font-black text-green-400">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t text-center">
        <div className="flex justify-center gap-10 text-xs uppercase tracking-widest text-slate-400 mb-4">
          <a href="/about">Our Vision</a>
          <a href="/career">Careers</a>
          <a href="/support">Support</a>
        </div>
        <p className="text-slate-400 text-xs flex justify-center items-center gap-2">
          <Library size={12} /> RoomGi Pvt Ltd • 2026
        </p>
      </footer>
    </div>
  );
};

export default CEO;
