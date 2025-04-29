"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function BooksGrid() {
    const [hoveredBook, setHoveredBook] = useState(null)
    const [activeCategory, setActiveCategory] = useState("all")
    const [filteredBooks, setFilteredBooks] = useState([])
    const [isInView, setIsInView] = useState(false)
    const gridRef = useRef(null)

    // Sample book data with categories - replace with your actual data
    const books = [
        {
            id: "1",
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt & David Thomas",
            coverImage: "/programmer.png?height=400&width=250",
            link: "https://literal.club/book/the-pragmatic-programmer-f735w",
            year: 1999,
            category: "technical",
        },
        {
            id: "2",
            title: "Go Programming Blueprints",
            author: "Mat Ryer",
            coverImage: "/go.png?height=400&width=250",
            link: "https://literal.club/book/mat-ryer-go-programming-blueprints-solving-development-challenges-with-golang-7qjew",
            year: 2022,
            category: "technical",
        },
        {
            id: "3",
            title: "Hands-On Software Engineering with Golang",
            author: "Achilleas Anagnostopoulos",
            coverImage: "/soft_go.png?height=400&width=250",
            link: "https://literal.club/book/hands-on-software-engineering-with-golang-9fmgb",
            year: 2020,
            category: "technical",
        },
        {
            id: "4",
            title: "CSS In Depth",
            author: "Keith J. Grant",
            coverImage: "/css.png?height=400&width=250",
            link: "https://literal.club/book/css-in-depth-gdlnw",
            year: 2018,
            category: "technical",
        },
        {
            id: "5",
            title: "平凡的世界",
            author: "路遥",
            coverImage: "/pingfan.jpg?height=400&width=250",
            link: "https://literal.club/book/-bx4e9",
            year: 2021,
            category: "novel",
        },
        {
            id: "6",
            title: "三体",
            author: "刘慈欣",
            coverImage: "/santi.png?height=400&width=250",
            link: "https://literal.club/book/-yrk0r",
            year: 2008,
            category: "novel",
        },
        {
            id: "7",
            title: "活着",
            author: "余华",
            coverImage: "/huozhe.png?height=400&width=250",
            link: "https://baike.baidu.com/item/%E6%B4%BB%E7%9D%80/10565923",
            year: 1992,
            category: "novel",
        },
        {
            id: "8",
            title: "第一财经周刊",
            author: "",
            coverImage: "/economic.jpeg?height=400&width=250",
            link: "https://www.cbnweek.com/",
            year: 2024,
            category: "non-tech-learning",
        },
        {
            id: "9",
            title: "牛奶可乐经济学",
            author: "Robert H. Frank",
            coverImage: "/milk_cola.png?height=400&width=250",
            link: "https://literal.club/book/robert-h-frank-economic-naturalis-ilwdo",
            year: 2008,
            category: "non-tech-learning",
        },
    ]

    // Get category counts
    const getCategoryCounts = () => {
        const counts = {
            technical: 0,
            novel: 0,
            "non-tech-learning": 0,
        }

        books.forEach((book) => {
            if (counts[book.category] !== undefined) {
                counts[book.category]++
            }
        })

        return counts
    }

    const categoryCounts = getCategoryCounts()

    // Filter books when category changes
    useEffect(() => {
        if (activeCategory === "all") {
            setFilteredBooks(books)
        } else {
            setFilteredBooks(books.filter((book) => book.category === activeCategory))
        }
    }, [activeCategory])

    // Set up intersection observer to detect when component is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                // Update isInView state based on whether the component is visible
                setIsInView(entry.isIntersecting)
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1, // Trigger when at least 10% of the element is visible
            },
        )

        if (gridRef.current) {
            observer.observe(gridRef.current)
        }

        // Cleanup function to remove the observer when component unmounts
        return () => {
            if (gridRef.current) {
                observer.unobserve(gridRef.current)
            }
        }
    }, []) // Empty dependency array means this effect runs once on mount

    // Animation variants for the container
    const containerVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    }

    // Animation variants for each book card
    const bookCardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: 1,
            },
        },
    }

    // Animation key that changes when isInView changes, forcing re-animation
    const animationKey = isInView ? "visible" : "hidden"

    return (
        <div className="container mx-auto px-4 py-12" ref={gridRef}>
            <motion.div
                key={`header-${animationKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1 }}
                className="mb-8"
            >
                <h2 className="text-3xl font-bold tracking-tight">Books</h2>
                <p className="text-muted-foreground mt-2">A collection of books I've read and recommend.</p>
            </motion.div>

            {/* Category tabs */}
            <motion.div
                key={`tabs-${animationKey}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 3, delay: 0.2 }}
                className="flex border-b border-gray-200 mb-8"
            >
                <button
                    onClick={() => setActiveCategory("all")}
                    className={`mr-8 py-2 font-medium relative ${
                        activeCategory === "all" ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveCategory("technical")}
                    className={`mr-8 py-2 font-medium relative ${
                        activeCategory === "technical"
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Technical
                    <sup className="ml-1 text-xs font-normal text-gray-500">{categoryCounts.technical}</sup>
                </button>
                <button
                    onClick={() => setActiveCategory("novel")}
                    className={`mr-8 py-2 font-medium relative ${
                        activeCategory === "novel"
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Novel
                    <sup className="ml-1 text-xs font-normal text-gray-500">{categoryCounts.novel}</sup>
                </button>
                <button
                    onClick={() => setActiveCategory("non-tech-learning")}
                    className={`mr-8 py-2 font-medium relative ${
                        activeCategory === "non-tech-learning"
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Non-tech Learning
                    <sup className="ml-1 text-xs font-normal text-gray-500">{categoryCounts["non-tech-learning"]}</sup>
                </button>
            </motion.div>

            <motion.div
                key={`grid-${animationKey}`}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {filteredBooks.map((book, index) => (
                    <motion.div
                        key={`${book.id}-${animationKey}`}
                        variants={bookCardVariants}
                        custom={index}
                        className="perspective-1000 w-full h-full"
                        onMouseEnter={() => setHoveredBook(book.id)}
                        onMouseLeave={() => setHoveredBook(null)}
                    >
                        <div
                            className={`relative w-full aspect-[3/3.5] transition-all duration-500 transform-style-3d ${
                                hoveredBook === book.id ? "rotate-y-180" : ""
                            }`}
                        >
                            {/* Front side - Book cover */}
                            <div className="absolute inset-0 backface-hidden bg-white rounded-lg shadow-sm">
                                <div className="w-full h-full flex items-center justify-center p-4">
                                    <img
                                        src={book.coverImage || "/placeholder.svg"}
                                        alt={`Cover of ${book.title}`}
                                        className="h-full max-h-[200px] w-auto object-contain shadow-md"
                                    />
                                </div>
                            </div>

                            {/* Back side - Book info */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#2d3e50] rounded-lg p-4 flex flex-col justify-center shadow-md">
                                <h3 className="font-medium text-base text-white mb-1">{book.title}</h3>
                                <div className="flex justify-between items-center mt-1 mb-2">
                                    <p className="text-xs text-gray-300">{book.author}</p>
                                    <p className="text-xs text-gray-300">{book.year}</p>
                                </div>
                                <Link href={book.link} className="mt-auto flex items-center text-xs text-gray-300 hover:text-white">
                                    <span>Read more</span>
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
