"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "motion/react"
import ThreeDPhotoCarousel from "@/components/ui/ThreeDPhotoCarousel"

export default function ThreeDPhotoCarouselDemo() {
    // 使用 useRef 创建对元素的引用
    const ref = useRef(null)
    // 创建状态来跟踪元素是否在视口中
    const [inView, setInView] = useState(false)
    // 使用 Framer Motion 的动画控制器
    const controls = useAnimation()

    // 使用原生的 Intersection Observer API
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // 当可见性变化时更新状态
                setInView(entry.isIntersecting)
            },
            {
                threshold: 0.1, // 当元素有10%进入视口时触发
            },
        )

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        // 清理函数
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [])

    // 当元素进入视口时触发动画
    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.2,
                },
            })
        } else {
            controls.start({
                opacity: 0,
                scale: 0.8,
                y: 100,
                transition: {
                    duration: 0.3,
                    ease: "easeIn",
                },
            })
        }
    }, [inView, controls])

    return (
        <div className="w-full max-w-6xl">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={controls}
                className="min-h-[800px] flex flex-col justify-center  border-dashed rounded-lg space-y-4"
            >
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold tracking-tight">Movie</h2>
                    <p className="text-muted-foreground mt-2">A collection of movie I&apos; ve watched and recommend.</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-white to-gray-300 border shadow-2xl rounded-[40px]">
                    <ThreeDPhotoCarousel />
                </div>
            </motion.div>
        </div>
    )
}
