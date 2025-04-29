'use client'
import React, {useEffect, useRef} from "react";

import {ThreeDCardDemo} from "@/components/function/3D-Card";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import GlassNavbar from "@/components/ui/glass-navbar";
import RotatingSpheres from "@/components/ui/RotatingSpheres";
import {MarqueeDemo} from "@/components/function/marqueen";
import SkillsSection from "@/components/function/skills" ;
import "@/components/function/3D-Card.css";
import Link from 'next/link'
import ExpandableCardDemo from "@/components/function/expandable-music-card";
import BooksGrid from "@/components/function/BookColumn";
import ThreeDPhotoCarouselDemo from "@/components/function/ThreeDPhotoCarouselDemo";
import TextRevealCardPreview from "@/components/function/TextRevealCardPreview";
import {SocialFooter} from "@/components/function/Social-footer";

export default function Home() {
    const progressRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 添加交叉检测逻辑
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-progress');
                    console.log('Element is visible!'); // 调试用
                } else {
                    entry.target.classList.remove('animate-progress'); // 重置动画
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px' // 底部提前50px触发
        });

        const current = progressRef.current;
        if (current) {
            observer.observe(current);
        }

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);
  return (
  <React.Fragment>
      <BackgroundBeamsWithCollision className="h-auto">

      <GlassNavbar className="sticky top-0 z-50"/>
          <div className="container mx-auto px-4 py-8">
              <section id="home-section" className="min-h-screen flex items-center justify-center pt-50" ref={useRef(null)}>
                  <RotatingSpheres width={550} >
                      <ThreeDCardDemo/>
                  </RotatingSpheres>

              </section>
              <section id="note-section" className="min-h-screen flex flex-col items-center justify-center pt-70" ref={useRef(null)}>
                  <div>

                          <h1 className="text-3xl  mb-4 left-20">
                              I have always had a great passion for learning programming.<br/>
                              Here are some of the knowledge about the Go language technology stack that<br/>
                              <span ref={progressRef} className="progress-trigger inline-block relative">I am proficient in and have mastered.</span></h1>

                  </div>
                  <MarqueeDemo className="w-full max-w-6xl"/>
                  <div>


                          <h1 className="text-3xl  mb-4 left-20">
                              <br/>
                              While learning about these high-performance tools, I also took some notes.<br/>
                              <Link
                                  href="/note"
                                  className="progress-trigger inline-block relative text-orange-400 hover:text-orange-500 underline transition-colors"
                              >
                                  Discovery my inspirations here 🔗
                              </Link>
                          </h1>

                  </div>
              </section>
              <section id="code-section" className="min-h-screen flex flex-col items-center justify-center pt-70" ref={useRef(null)}>
                  <SkillsSection/>
              </section>
              <section id="music-section" className="min-h-screen flex flex-col items-center justify-center pt-70" ref={useRef(null)}>
                  <ExpandableCardDemo/>
              </section>
              <section id="book-section" className="min-h-screen flex flex-col items-center justify-center pt-70" ref={useRef(null)}>
                  <BooksGrid/>
              </section>
              <section id="movie-section" className="min-h-screen flex flex-col items-center justify-center pt-50" ref={useRef(null)}>
                  <ThreeDPhotoCarouselDemo/>
              </section>
              <section id="movie-section" className="min-h-screen flex flex-col items-center justify-center pt-50" ref={useRef(null)}>
                  <TextRevealCardPreview/>
              </section>
              <SocialFooter
                  githubUrl="https://github.com/Cyrus-YSR"
                  facebookUrl="https://www.facebook.com/profile.php?id=61571781369012"
                  instagramUrl="https://www.youtube.com/feed/you"
              />
          </div>


      </BackgroundBeamsWithCollision>

  </React.Fragment>
  );
}
