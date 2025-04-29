"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {ThreeDCardDemo} from "@/components/function/3D-Card";

export default function RotatingSpheres({
                                           width = 650,
                                           children,
                                           items = [
                                               { id: 1, image: "/p6.jpg", height:"100", width:"100", color: "#ff9d00" },
                                               { id: 2, image: "/p2.jpg", height:"100", width:"100", color: "#3498db" },
                                               { id: 3, image: "/p7.jpg", height:"100", width:"100", color: "#e74c3c" },
                                               { id: 4, image: "/p5.jpg", height:"100", width:"100", color: "#2ecc71" },
                                           ],
                                           rotationSpeed = 10, // seconds for a full rotation
                                           dotSize = 200,
                                           borderStyle = "dashed", // solid, dashed, dotted
                                           borderColor = "rgba(0, 0, 0, 0.2)",
                                           interactive = true,
                                       }) {
    const [rotation, setRotation] = useState(0)
    const requestRef = useRef()
    const previousTimeRef = useRef()
    const containerRef = useRef()
    const [isPaused, setIsPaused] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Animation loop for rotation
    const animate = (time) => {
        if (previousTimeRef.current !== undefined && !isPaused) {
            const deltaTime = time - previousTimeRef.current
            // Convert rotation speed from seconds to milliseconds
            const rotationIncrement = (deltaTime / (rotationSpeed * 1000)) * 360
            setRotation((prevRotation) => (prevRotation + rotationIncrement) % 360)
        }
        previousTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    // Handle mouse interaction
    const handleMouseMove = (e) => {
        if (!interactive || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate angle between mouse and center
        const dx = e.clientX - centerX
        const dy = e.clientY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Only interact when mouse is near the circle
        const radius = width / 2
        const isNearCircle = Math.abs(distance - radius) < 50

        if (isNearCircle) {
            setIsPaused(true)

            // Calculate angle in degrees
            let angle = Math.atan2(dy, dx) * (180 / Math.PI)
            if (angle < 0) angle += 360

            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            setRotation(angle)
        } else {
            setIsPaused(false)
        }
    }

    const handleMouseLeave = () => {
        setIsPaused(false)
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(requestRef.current)
    }, [isPaused])

    return (
        <div
            className="relative"
            ref={containerRef}
            style={{ width: `${width}px`, height: `${width}px` }}

        >
            {/* Circle border */}
            <div
                className="absolute rounded-full"
                style={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: `1px ${borderStyle} ${borderColor}`,
                }}
            ></div>

            {/* Rotating items */}
            {items.map((item, index) => {
                // Calculate position for each item
                const itemAngle = rotation + (index * 360) / items.length
                const radians = (itemAngle * Math.PI) / 180
                const radius = width / 2
                const x = radius + radius * Math.cos(radians) - dotSize / 2
                const y = radius + radius * Math.sin(radians) - dotSize / 2

                return (
                    <div
                        key={item.id}
                        className="absolute rounded-full overflow-hidden flex items-center justify-center"
                        style={{
                            width: `${dotSize}px`,
                            height: `${dotSize}px`,
                            left: `${x}px`,
                            top: `${y}px`,
                            backgroundColor: item.color,
                            transition: isPaused ? "left 0.2s, top 0.2s" : "none",
                        }}
                    >
                        {item.image && (
                            <Image
                                src={item.image || "/placeholder.svg"}
                                alt={`Item ${item.id}`}
                                width={dotSize}
                                height={dotSize}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                )
            })}

            {/* Center content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{children}</div>

        </div>

    )

}
