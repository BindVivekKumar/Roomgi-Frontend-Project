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
        <section className="mt-32 bg-gradient-to-br from-slate-950 via-slate-900 to-black rounded-[3rem] p-12 lg:p-16 text-white">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>

              <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                Founder & Vision
              </span>

              <h2 className="mt-6 text-5xl lg:text-6xl font-black leading-tight">
                Building Companies
                <br />
                That Create
                <span className="text-green-400"> Lasting Impact.</span>
              </h2>

              <p className="mt-8 text-lg leading-8 text-slate-300">
                Great businesses are built on clarity of vision, relentless execution,
                and a commitment to solving real-world challenges. Our mission is to
                transform ambitious ideas into scalable digital products that create
                measurable value for organizations, communities, and the people who use them.
              </p>

              <p className="mt-6 text-slate-400 leading-8">
                We believe innovation is not about following trends—it's about
                understanding problems deeply, designing thoughtful solutions, and
                delivering products that remain valuable for years to come. Every
                decision we make is driven by quality, trust, and long-term thinking.
              </p>

              <div className="flex gap-4 mt-10">
                <button className="rounded-full bg-green-500 px-8 py-4 font-semibold hover:bg-green-600 transition">
                  Our Vision
                </button>

                <button className="rounded-full border border-white/15 px-8 py-4 font-semibold hover:bg-white/10 transition">
                  Founder Journey
                </button>
              </div>

            </div>

            {/* Right */}
            <div className="grid grid-cols-2 gap-5">

              {[
                {
                  title: "Vision",
                  value: "Purpose-Driven",
                  desc: "Building meaningful products that solve genuine business and human challenges."
                },
                {
                  title: "Leadership",
                  value: "Innovation First",
                  desc: "Creating an environment where creativity, ownership, and excellence thrive."
                },
                {
                  title: "Commitment",
                  value: "Quality Always",
                  desc: "Every solution is designed with performance, scalability, and reliability in mind."
                },
                {
                  title: "Future",
                  value: "Global Impact",
                  desc: "Growing sustainable businesses that deliver long-term value across industries."
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-green-400/40 hover:bg-white/10"
                >
                  <p className="text-sm uppercase tracking-[3px] text-green-400">
                    {item.title}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    {item.value}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </section>
      </main>


    </div>
  );
};

export default CEO;
