"use client"
import {useEffect, useRef, useState} from "react"
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(100px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0px) scale(1);
    }
  }
`;
export default function SkillsSection() {
    const skills = [
        {
            name: "golang",
            proficiency: 80,
            hoverContent: "Backend development, cloud-disk, IM instant messaging, E-commerce platform base on micro-service.",
        },
        {
            name: "python",
            proficiency: 50,
            hoverContent: "Developed a simple version of Plants vs. Zombies.",
        },
        {
            name: "JavaScript / TypeScript",
            proficiency: 60,
            hoverContent: "Experience with ES6+, TypeScript, async programming, and modern JS frameworks.",
        },
        {
            name: "React / NextJS",
            proficiency: 65,
            hoverContent: "Building responsive UIs, state management, server components, and full-stack applications.",
        },
        {
            name: "C++",
            proficiency: 75,
            hoverContent: "Systems programming, performance optimization, and memory management.",
        },
        {
            name: "MySQL",
            proficiency: 70,
            hoverContent: "Experience in performance tuning, familiar with MySQL fundamentals,Use mysql's pessimistic lock and optimistic lock.",
        },
        {
            name: "Redis",
            proficiency: 70,
            hoverContent: "Implementation of Captcha Timeout and Blacklisting Mechanism in Login Module Using redis And implement distributed transaction locks to ensure data consistency.",
        },
        {
            name: "RocketMQ",
            proficiency: 40,
            hoverContent: "Using RockeMQ to Implement Distributed Transactions for E-Commerce Services, Rolling Back Inventory",
        },
        {
            name: "Data Structure / Algorithms / ACM-ICPC",
            proficiency: 55,
            hoverContent: "I trained for 2 years, attended Programming Contest and won the Bronze Medal for the Asian regional of the ACM-ICPC (International Collegiate Student Programming Contest).",
        },
        {
            name: "Docker / Kubernetes",
            proficiency: 25,
            hoverContent: "Use these containerization tools to deploy the middleware to package the application as a container image through the dockerfile.",
        },
    ]
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentSectionRef = sectionRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            });
        });

        if (currentSectionRef) {
            observer.observe(currentSectionRef);
        }

        return () => {
            if (currentSectionRef) {
                observer.unobserve(currentSectionRef);
            }
        };
    }, []);
    return (
        <>
            <style>{styles}</style>
            <div
                ref={sectionRef}
                className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
                    isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-25 scale-80"
                } transition-all duration-2000 ease-out`}
            >
            {/* First row - 4 equal cards */}
            <div className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {skills.slice(0, 4).map((skill, index) => (
                    <SkillCard key={index} name={skill.name} proficiency={skill.proficiency} hoverContent={skill.hoverContent} />
                ))}
            </div>

            {/* Second row - 4 equal cards */}
            <div className="md:col-span-3 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {skills.slice(4, 8).map((skill, index) => (
                    <SkillCard
                        key={index + 4}
                        name={skill.name}
                        proficiency={skill.proficiency}
                        hoverContent={skill.hoverContent}
                    />
                ))}

                {/* Experience card */}
                {/*<div className="bg-[#2d3e50] text-white p-6 rounded-lg shadow-lg">*/}
                {/*    <p className="text-lg">*/}
                {/*        I learned Deep Learning for one year. And I'm enjoying Data Visualization and Data Analysis. I built*/}
                {/*        personal tools to do Finance Accounting, Stock Analyzing, Youtuber Analyzing, etc.*/}
                {/*    </p>*/}
                {/*</div>*/}
            </div>

            {/* Third row - 3 equal parts */}
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="shadow-lg">
                    <SkillCard name={skills[8].name} proficiency={skills[8].proficiency} hoverContent={skills[8].hoverContent} />
                </div>

                {/* Skills title card - no hover effect */}
                <div className="bg-[#2d3e50] p-6 rounded-lg shadow-lg flex items-center justify-center">
                    <h2 className="text-[#f7913d] text-5xl md:text-8xl font-bold">Skills</h2>
                </div>

                {/* Last card */}
                <div className="shadow-lg">
                    <SkillCard name={skills[9].name} proficiency={skills[9].proficiency} hoverContent={skills[9].hoverContent} />
                </div>
            </div>
        </div>
        </>
    );
}

function SkillCard({ name, proficiency, hoverContent }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={`p-8 rounded-lg shadow-lg relative overflow-hidden transition-colors duration-300 h-full min-h-[200px] w-full max-w-full ${isHovered ? "bg-[#2d3e50] text-white" : "bg-white"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative z-10">
                {!isHovered && <SkillCardContent name={name} proficiency={proficiency} />}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 w-full h-full flex items-center bg-[#2d3e50] text-white p-4 rounded-t-lg transform transition-transform duration-500 ease-out ${isHovered ? 'translate-x-1 translate-y-0' : '-translate-x-full -translate-y-full'}  overflow-y-auto`}>
                <p className="whitespace-normal break-words">{hoverContent}</p>
            </div>
        </div>
    )
}

function SkillCardContent({ name, proficiency, hoverContent }) {
    return (
        <>
            <h3 className="text-lg font-mono">{name}</h3>
            <div className="mt-2 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-gray-500 h-full rounded-full" style={{ width: `${proficiency}%` }}></div>
            </div>
        </>
    )
}
