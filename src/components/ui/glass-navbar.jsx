"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

// import { Button } from "@/components/ui/button"

export default function GlassNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="backdrop-blur-md bg-white/0.00001 border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and brand */}
                        <div className="flex items-center">
                            <Link href="#home-section" className="flex-shrink-0 text-black font-bold text-2xl"
                                  onClick={(e) => {
                                      e.preventDefault();
                                      const target = document.getElementById('home-section');
                                      if (target) {
                                          window.history.pushState({}, '', '#home-section');
                                          target.scrollIntoView({ behavior: 'smooth' });
                                      }
                                  }}
                            >
                                CyrusYSR
                            </Link>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-4">
                                <Link
                                    href="#home-section"
                                    scroll={false}
                                    className="text-black hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('home-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#home-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="#note-section"
                                    scroll={false}
                                    className="text-black/80 hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('note-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#note-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    NOTE
                                </Link>
                                <Link
                                    href="#code-section"
                                    scroll={false}
                                    className="text-black/80 hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('code-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#code-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    CODE
                                </Link>
                                <Link
                                    href="#music-section"
                                    scroll={false}
                                    className="text-black/80 hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('music-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#music-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    MUSIC
                                </Link>
                                <Link
                                    href="#book-section"
                                    scroll={false}
                                    className="text-black/80 hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('book-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#book-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    BOOKS
                                </Link>
                                <Link
                                    href="#movie-section"
                                    scroll={false}
                                    className="text-black/80 hover:text-black hover:bg-amber-500 px-3 py-2 rounded-md text-sm font-black transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target = document.getElementById('movie-section');
                                        if (target) {
                                            window.history.pushState({}, '', '#movie-section');
                                            target.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    MOVIE
                                </Link>
                            </div>
                        </div>

                        {/* CTA Button */}
                        {/*<div className="hidden md:block">*/}
                        {/*    <Button className="bg-gradient-to-r from-white to-neutral-100 text-black border-0 hover:opacity-90 transition-opacity">*/}
                        {/*        Get Started*/}
                        {/*    </Button>*/}
                        {/*</div>*/}

                        {/* Mobile menu button */}
                        <div className="md:hidden ">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden backdrop-blur-md bg-black/30">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="/my-app/public" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">
                                Home
                            </Link>
                            <Link
                                href="/NOTE"
                                className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                            >
                                NOTE
                            </Link>
                            <Link
                                href="/CODE"
                                className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                            >
                                CODE
                            </Link>
                            <Link
                                href="/MUSIC"
                                className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                            >
                                MUSIC
                            </Link>
                            <Link
                                href="/BOOKS"
                                className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                            >
                                BOOKS
                            </Link>
                            <Link
                                href="/MOVIE"
                                className="text-white/80 block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-white"
                            >
                                MOVIE
                            </Link>
                            <div className="pt-2">
                                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:opacity-90 transition-opacity">
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
