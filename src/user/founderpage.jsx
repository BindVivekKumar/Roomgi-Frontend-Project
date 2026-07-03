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
       <section className="mt-36 overflow-hidden rounded-[40px] bg-gradient-to-br from-[#050505] via-slate-950 to-black text-white">

  <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">

    <div className="grid lg:grid-cols-2 gap-20 items-center">

      {/* LEFT CONTENT */}
      <div>

        <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-green-400">
          Founder • Leadership • Vision
        </span>

        <h2 className="mt-8 text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
          Building Products.
          <br />
          Building Trust.
          <br />
          <span className="text-green-400">
            Building the Future.
          </span>
        </h2>

        <p className="mt-10 text-lg leading-9 text-slate-300 max-w-xl">
          Every transformative company begins with a clear vision and an
          unwavering commitment to solving meaningful problems. At RoomGi,
          we are creating technology that makes finding trusted accommodation
          effortless while redefining how students, professionals and property
          owners connect across India.
        </p>

        <p className="mt-8 text-slate-400 leading-8 max-w-xl">
          Our philosophy is simple — innovate with purpose, execute with
          excellence, and build products that people genuinely rely on.
          We don't chase trends; we build long-term solutions designed
          to scale responsibly, inspire confidence, and create lasting value.
        </p>

        <div className="mt-12 flex flex-wrap gap-5">

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
            <p className="text-4xl font-black text-green-400">Vision</p>
            <p className="mt-2 text-sm text-slate-400">
              Creating technology that simplifies everyday living.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
            <p className="text-4xl font-black text-green-400">Mission</p>
            <p className="mt-2 text-sm text-slate-400">
              Deliver trusted experiences through innovation and execution.
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT CONTENT */}

      <div className="grid grid-cols-2 gap-6">

        {[
          {
            number: "01",
            title: "Purpose",
            desc: "We exist to solve real-world accommodation challenges with transparency, technology and trust."
          },
          {
            number: "02",
            title: "Leadership",
            desc: "Lead with integrity, inspire innovation and empower every individual to create meaningful impact."
          },
          {
            number: "03",
            title: "Execution",
            desc: "Great ideas matter only when they are executed with precision, speed and uncompromising quality."
          },
          {
            number: "04",
            title: "Legacy",
            desc: "Our ambition extends beyond building a company—we are building a platform that creates value for generations."
          }
        ].map((item) => (

          <div
            key={item.number}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-green-400/40 hover:bg-white/10"
          >

            <div className="absolute -right-6 -top-6 text-8xl font-black text-white/5">
              {item.number}
            </div>

            <h3 className="text-2xl font-bold">
              {item.title}
            </h3>

            <p className="mt-5 leading-8 text-slate-400">
              {item.desc}
            </p>

          </div>

        ))}

      </div>

    </div>

    {/* CEO QUOTE */}

    <div className="mt-24 border-t border-white/10 pt-14">

      <blockquote className="max-w-5xl text-3xl lg:text-5xl font-bold leading-tight text-slate-100">

        "The strongest companies aren't built by following the market—
        they're built by understanding people, solving meaningful problems,
        and earning trust every single day."

      </blockquote>

      <div className="mt-8 flex items-center gap-4">

        <div className="h-12 w-1 rounded-full bg-green-500"></div>

        <div>

          <p className="font-semibold text-lg">
            Ayush Raj
          </p>

          <p className="text-slate-400">
            Chief Executive Officer & Founder, RoomGi
          </p>

        </div>

      </div>

    </div>

  </div>

</section>
      </main>


    </div>
  );
};

export default CEO;
